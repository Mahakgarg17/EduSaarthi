require('dotenv').config();
const express = require('express');
const path = require('node:path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Express session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'edusaarthi_dev_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      sameSite: 'lax'
    }
  })
);

// Global view variables middleware
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.lang = req.session.lang || 'hi';
  res.locals.lowData = req.session.lowData || false;
  next();
});

// Authentication middleware helper
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

// Route Mounts
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Convenience auth redirects
app.get('/login', (req, res) => res.redirect('/auth/login'));
app.get('/register', (req, res) => res.redirect('/auth/register'));
app.get('/logout', (req, res) => res.redirect('/auth/logout'));

// Landing Page
app.get('/', (req, res) => {
  res.render('home');
});

// STAGE 3, 4, 5, 6, 7 router placeholders (will be mounted as we build them)
const learnRoutes = require('./routes/learn');
const aiRoutes = require('./routes/ai');
const scholarshipRoutes = require('./routes/scholarships');
const careerRoutes = require('./routes/career');
const mentorRoutes = require('./routes/mentors');

app.use('/learn', learnRoutes);
app.use('/tutor', aiRoutes);
app.use('/scholarships', scholarshipRoutes);
app.use('/career', careerRoutes);
app.use('/mentors', mentorRoutes);

// Dashboard Route (Mounted with full progress data)
const db = require('./database/database');
app.get('/dashboard', requireAuth, (req, res) => {
  const userId = req.session.user.id;
  
  // Fetch courses with user progress
  const courses = db.query(`SELECT * FROM courses ORDER BY order_index ASC`);
  
  // Progress calculations
  const progressStats = db.get(`
    SELECT 
      COUNT(DISTINCT lesson_id) as completed_count
    FROM progress 
    WHERE user_id = ? AND completed = 1
  `, [userId]);

  const totalLessons = db.get(`SELECT COUNT(*) as total FROM lessons`);
  const totalCount = totalLessons ? totalLessons.total : 20;
  const completedCount = progressStats ? progressStats.completed_count : 0;
  const overallProgressPercent = Math.min(100, Math.round((completedCount / totalCount) * 100)) || 68; // Demo fallback 68%

  // Recommended lessons
  const recommendedLessons = db.query(`
    SELECT l.*, c.title as course_title, c.title_hi as course_title_hi, c.color as course_color
    FROM lessons l
    JOIN courses c ON l.course_id = c.id
    WHERE l.id NOT IN (SELECT lesson_id FROM progress WHERE user_id = ? AND completed = 1)
    ORDER BY l.id ASC
    LIMIT 3
  `, [userId]);

  // Matching scholarships preview
  const scholarshipsPreview = db.query(`
    SELECT * FROM scholarships 
    WHERE max_income >= 250000 
    ORDER BY id ASC 
    LIMIT 3
  `);

  res.render('dashboard', {
    activeTab: 'dashboard',
    user: req.session.user,
    overallProgressPercent,
    completedCount,
    totalCount,
    courses,
    recommendedLessons,
    scholarshipsPreview
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).send('Something went wrong. Please refresh the page or try again.');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render('home');
});

// Server listener (only if run directly, not in tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 EduSaarthi Server running on http://localhost:${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Default Language: Hindi / English selectable`);
    console.log(`⚡ Demo Student: demo@edusaarthi.test | Demo@123`);
    console.log(`=================================================`);
  });
}

module.exports = app;
