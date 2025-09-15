-- MindGraph Database Schema
-- PostgreSQL Database Setup Script

-- Create database (run this separately as superuser)
-- CREATE DATABASE mindgraph;

-- Connect to mindgraph database and run the following:

-- Enable UUID extension (optional, for UUID primary keys in future)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- User preferences table
CREATE TABLE user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferred_work_start_time TIME,
    preferred_work_end_time TIME,
    morning_energy_level INTEGER DEFAULT 3 CHECK (morning_energy_level >= 1 AND morning_energy_level <= 5),
    afternoon_energy_level INTEGER DEFAULT 3 CHECK (afternoon_energy_level >= 1 AND afternoon_energy_level <= 5),
    evening_energy_level INTEGER DEFAULT 3 CHECK (evening_energy_level >= 1 AND evening_energy_level <= 5),
    preferred_break_duration_minutes INTEGER DEFAULT 15 CHECK (preferred_break_duration_minutes >= 15 AND preferred_break_duration_minutes <= 480),
    max_continuous_work_minutes INTEGER DEFAULT 120 CHECK (max_continuous_work_minutes >= 30 AND max_continuous_work_minutes <= 300),
    buffer_time_minutes INTEGER DEFAULT 15 CHECK (buffer_time_minutes >= 5 AND buffer_time_minutes <= 60),
    enable_notifications BOOLEAN DEFAULT TRUE,
    default_reminder_minutes INTEGER DEFAULT 15,
    enable_smart_scheduling BOOLEAN DEFAULT TRUE,
    allow_ai_learning BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_task_id BIGINT REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    notes TEXT,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    priority VARCHAR(50) DEFAULT 'MEDIUM',
    difficulty VARCHAR(50) DEFAULT 'MEDIUM',
    estimated_duration_minutes INTEGER,
    actual_duration_minutes INTEGER,
    deadline TIMESTAMP,
    scheduled_start_time TIMESTAMP,
    scheduled_end_time TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Task resources table (for storing URLs, links, etc.)
CREATE TABLE task_resources (
    task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    resource_url TEXT NOT NULL,
    PRIMARY KEY (task_id, resource_url)
);

-- Task tags table
CREATE TABLE task_tags (
    task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (task_id, tag)
);

-- Events table
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    type VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    is_all_day BOOLEAN DEFAULT FALSE,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(50),
    reminder_minutes_before INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chatbot conversations table (for storing conversation history)
CREATE TABLE chatbot_conversations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'GENERAL', -- GENERAL, TASK_CREATION, SCHEDULE_QUERY, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI learning data table (for storing user behavior patterns)
CREATE TABLE ai_learning_data (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id BIGINT REFERENCES tasks(id) ON DELETE CASCADE,
    event_id BIGINT REFERENCES events(id) ON DELETE CASCADE,
    data_type VARCHAR(50) NOT NULL, -- TASK_COMPLETION_TIME, DIFFICULTY_RATING, ENERGY_LEVEL, etc.
    data_value TEXT NOT NULL,
    context_data JSONB, -- Additional context as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_scheduled_start ON tasks(scheduled_start_time);
CREATE INDEX idx_tasks_parent_task ON tasks(parent_task_id);

CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_end_time ON events(end_time);
CREATE INDEX idx_events_type ON events(type);

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_chatbot_conversations_user_id ON chatbot_conversations(user_id);
CREATE INDEX idx_ai_learning_data_user_id ON ai_learning_data(user_id);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
-- Sample user
INSERT INTO users (username, email, password, first_name, last_name) 
VALUES ('demo_user', 'demo@mindgraph.com', '$2a$10$dummy.hash.for.password', 'Demo', 'User');

-- Sample user preferences
INSERT INTO user_preferences (user_id, preferred_work_start_time, preferred_work_end_time)
VALUES (1, '09:00:00', '17:00:00');

-- Sample tasks
INSERT INTO tasks (user_id, title, description, type, priority, estimated_duration_minutes, deadline)
VALUES 
(1, 'Complete project proposal', 'Write and review the quarterly project proposal document', 'WORK', 'HIGH', 120, CURRENT_TIMESTAMP + INTERVAL '2 days'),
(1, 'Read Chapter 5 of Dragon Book', 'Study compiler design concepts from the famous Dragon Book', 'STUDY', 'MEDIUM', 90, CURRENT_TIMESTAMP + INTERVAL '1 week'),
(1, 'Team standup meeting', 'Daily team synchronization meeting', 'MEETING', 'MEDIUM', 30, CURRENT_TIMESTAMP + INTERVAL '1 day');

-- Sample events
INSERT INTO events (user_id, title, description, start_time, end_time, type)
VALUES 
(1, 'Project Kickoff Meeting', 'Initial meeting for the new project', 
 CURRENT_TIMESTAMP + INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '1 hour', 'MEETING'),
(1, 'Lunch Break', 'Daily lunch break', 
 CURRENT_DATE + INTERVAL '12 hours', CURRENT_DATE + INTERVAL '13 hours', 'BREAK');

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mindgraph_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mindgraph_user;
