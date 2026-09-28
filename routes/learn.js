const express = require('express');
const router = express.Router();
const db = require('../database/database');

// 1. List Courses / Categories
router.get('/', (req, res) => {
  const categoryFilter = req.query.category;
  let courses;
  if (categoryFilter && categoryFilter !== 'All') {
    courses = db.query('SELECT * FROM courses WHERE category = ? ORDER BY order_index ASC', [categoryFilter]);
  } else {
    courses = db.query('SELECT * FROM courses ORDER BY order_index ASC');
  }

  // Get total lesson count per course
  const coursesWithCounts = courses.map(c => {
    const lessonCount = db.get('SELECT COUNT(*) as count FROM lessons WHERE course_id = ?', [c.id]);
    return {
      ...c,
      total_lessons: lessonCount ? lessonCount.count : 0
    };
  });

  const categories = ['All', 'Science', 'Mathematics', 'English', 'Social Science', 'Computer Science'];

  res.render('learn', {
    activeTab: 'learn',
    courses: coursesWithCounts,
    categories,
    selectedCategory: categoryFilter || 'All'
  });
});

// 2. View Specific Course
router.get('/:courseSlug', (req, res) => {
  const { courseSlug } = req.params;
  const course = db.get('SELECT * FROM courses WHERE slug = ?', [courseSlug]);

  if (!course) {
    return res.redirect('/learn');
  }

  const lessons = db.query('SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index ASC', [course.id]);

  // Check user progress if logged in
  let userProgress = {};
  if (req.session.user) {
    const progressList = db.query('SELECT lesson_id, completed, quiz_score FROM progress WHERE user_id = ?', [req.session.user.id]);
    progressList.forEach(p => {
      userProgress[p.lesson_id] = p;
    });
  }

  res.render('course', {
    activeTab: 'learn',
    course,
    lessons,
    userProgress
  });
});

// 3. View Lesson by ID
router.get('/lesson/:id', (req, res) => {
  const lessonId = parseInt(req.params.id, 10);
  const lesson = db.get('SELECT * FROM lessons WHERE id = ?', [lessonId]);

  if (!lesson) {
    return res.redirect('/learn');
  }

  const course = db.get('SELECT * FROM courses WHERE id = ?', [lesson.course_id]);

  // Previous and Next lessons
  const prevLesson = db.get(
    'SELECT id, title, title_hi FROM lessons WHERE course_id = ? AND order_index < ? ORDER BY order_index DESC LIMIT 1',
    [lesson.course_id, lesson.order_index]
  );
  const nextLesson = db.get(
    'SELECT id, title, title_hi FROM lessons WHERE course_id = ? AND order_index > ? ORDER BY order_index ASC LIMIT 1',
    [lesson.course_id, lesson.order_index]
  );

  // Parse JSON data safely
  let keyPoints = [];
  let keyPointsHi = [];
  let quizData = [];
  try {
    keyPoints = JSON.parse(lesson.key_points || '[]');
    keyPointsHi = JSON.parse(lesson.key_points_hi || '[]');
    quizData = JSON.parse(lesson.quiz_data || '[]');
  } catch (e) {
    console.error('Error parsing lesson JSON:', e);
  }

  res.render('lesson', {
    activeTab: 'learn',
    lesson,
    course,
    prevLesson,
    nextLesson,
    keyPoints,
    keyPointsHi,
    quizData
  });
});

// 4. API to Download Lesson for Offline Cache / IndexedDB
router.get('/api/lesson/:id', (req, res) => {
  const lessonId = parseInt(req.params.id, 10);
  const lesson = db.get('SELECT * FROM lessons WHERE id = ?', [lessonId]);
  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' });
  }
  const course = db.get('SELECT title, title_hi, category FROM courses WHERE id = ?', [lesson.course_id]);
  res.json({
    ...lesson,
    course
  });
});

// 5. Update Progress on Quiz Submission
router.post('/progress/:lessonId', (req, res) => {
  if (!req.session.user) {
    return res.json({ success: true, guest: true });
  }

  const lessonId = parseInt(req.params.lessonId, 10);
  const { quizScore, completed } = req.body;
  const userId = req.session.user.id;

  try {
    const existing = db.get('SELECT id FROM progress WHERE user_id = ? AND lesson_id = ?', [userId, lessonId]);
    if (existing) {
      db.run(
        'UPDATE progress SET completed = ?, quiz_score = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [completed ? 1 : 0, quizScore || 0, existing.id]
      );
    } else {
      db.run(
        'INSERT INTO progress (user_id, lesson_id, completed, quiz_score) VALUES (?, ?, ?, ?)',
        [userId, lessonId, completed ? 1 : 0, quizScore || 0]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Progress update error:', err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

module.exports = router;
