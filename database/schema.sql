-- EduSaarthi SQLite Database Schema
-- Designed for easy migration to MySQL / PostgreSQL

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    state TEXT DEFAULT 'All India',
    preferred_language TEXT DEFAULT 'en', -- 'en' or 'hi'
    education_level TEXT DEFAULT 'Class 10',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Science', 'Mathematics', 'Social Science', 'English', 'Computer Science'
    education_level TEXT NOT NULL,
    description TEXT NOT NULL,
    description_hi TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#2563EB',
    total_lessons INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    summary TEXT NOT NULL,
    summary_hi TEXT NOT NULL,
    content TEXT NOT NULL,
    content_hi TEXT NOT NULL,
    examples TEXT NOT NULL,
    examples_hi TEXT NOT NULL,
    key_points TEXT NOT NULL, -- JSON array of strings
    key_points_hi TEXT NOT NULL, -- JSON array of strings
    quiz_data TEXT NOT NULL, -- JSON object with questions, options, answer
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lesson_id INTEGER NOT NULL,
    completed INTEGER DEFAULT 0,
    quiz_score INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS scholarships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    provider TEXT NOT NULL,
    education_level TEXT NOT NULL,
    category TEXT NOT NULL, -- 'All', 'SC', 'ST', 'OBC', 'General', 'Minority'
    state TEXT NOT NULL DEFAULT 'All India',
    gender TEXT NOT NULL DEFAULT 'All', -- 'All', 'Female', 'Male'
    max_income INTEGER NOT NULL, -- in INR per annum
    min_percentage REAL NOT NULL DEFAULT 50.0,
    disability_status TEXT DEFAULT 'No', -- 'No', 'Yes', 'Either'
    benefit_amount TEXT NOT NULL,
    deadline TEXT NOT NULL,
    description TEXT NOT NULL,
    description_hi TEXT NOT NULL,
    required_documents TEXT NOT NULL, -- JSON array
    official_portal TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS mentors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    field TEXT NOT NULL,
    field_hi TEXT NOT NULL,
    experience_years INTEGER NOT NULL,
    languages TEXT NOT NULL,
    availability TEXT NOT NULL,
    rating REAL NOT NULL DEFAULT 4.8,
    bio TEXT NOT NULL,
    avatar_initials TEXT NOT NULL,
    avatar_bg TEXT NOT NULL DEFAULT '#3B82F6'
);

CREATE TABLE IF NOT EXISTS mentor_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    mentor_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    message TEXT,
    preferred_language TEXT DEFAULT 'Hindi + English',
    status TEXT DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Geography', 'Political Science', 'Economics', 'Science', 'Mathematics', 'English', 'General Knowledge'
    education_level TEXT NOT NULL DEFAULT 'Class 10',
    description TEXT NOT NULL,
    description_hi TEXT NOT NULL,
    time_limit_minutes INTEGER DEFAULT 5,
    total_questions INTEGER DEFAULT 5,
    difficulty TEXT DEFAULT 'Intermediate', -- 'Easy', 'Intermediate', 'Advanced'
    icon TEXT DEFAULT '📝',
    is_daily_challenge INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    question_hi TEXT NOT NULL,
    options TEXT NOT NULL, -- JSON array of 4 options [A, B, C, D]
    options_hi TEXT NOT NULL, -- JSON array of 4 options in Hindi
    correct_index INTEGER NOT NULL, -- 0, 1, 2, or 3
    explanation TEXT NOT NULL,
    explanation_hi TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    quiz_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    time_taken_seconds INTEGER NOT NULL DEFAULT 60,
    user_answers TEXT NOT NULL, -- JSON array of chosen option indices
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_settings (
    user_id INTEGER PRIMARY KEY,
    preferred_language TEXT DEFAULT 'hi',
    low_data INTEGER DEFAULT 0,
    voice_enabled INTEGER DEFAULT 1,
    theme TEXT DEFAULT 'light', -- 'light', 'high-contrast', 'dark'
    college_name TEXT DEFAULT 'Birsa Munda Inter College',
    target_career TEXT DEFAULT 'Public Administration & Civil Services',
    subjects TEXT DEFAULT 'Geography, Political Science, Economics, Science',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for optimized querying
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_scholarships_state ON scholarships(state);
CREATE INDEX IF NOT EXISTS idx_scholarships_category ON scholarships(category);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_slug ON quizzes(slug);
