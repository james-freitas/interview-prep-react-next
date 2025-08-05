-- Table: topics
CREATE TABLE topics (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL
);

-- Table: subtopics
CREATE TABLE subtopics (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  url TEXT,
  content TEXT,
  user_id VARCHAR(255) NOT NULL
);
