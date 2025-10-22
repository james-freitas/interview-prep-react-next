# 🧠 Topic & Subtopic Tracker

A simple, modern web application built with React, Supabase, and TypeScript that lets each user create, edit, view, and track their own study topics and subtopics, with support for external links, notes, and authentication.

## 🚀 Technologies

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.io/) (database, authentication, API)
- [CSS Modules](https://github.com/css-modules/css-modules)

---

## 🔐 Authentication

- Email/password and Google sign-in
- Each user sees only their own topics and subtopics

---

## ✍️ Features

### Topics

- ✅ Create a new topic
- ✏️ Edit a topic title
- 🗑️ Delete a topic

### Subtopics

- ✅ Add a subtopic with:
  - Title
  - External link (optional)
  - Content/notes (optional)
- ✅ Mark as completed or not
- 🔎 View additional subtopic content

### Authentication

- Login with email/password
- Register new users
- Login with Google

---

## 📁 Project structure

```bash
.
├── index.tsx               # Main application page
├── src/
│   └── components/
│       ├── Auth.tsx        # Authentication component
│       └── GlobalCSS.tsx   # Global styles
├── lib/
│   └── supabase.ts         # Supabase client
└── styles/
    └── Auth.module.css     # Auth component styles
```

---

## 🛠️ Running locally

### Prerequisites

- Node.js v18+
- A Supabase account: https://app.supabase.com/

### 1. Clone the repo

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Supabase

Create a `.env.local` file with the variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Or set these values directly in `lib/supabase.ts`.

### 4. Start the app

```bash
npm run dev
```

Open http://localhost:3000

---

## 🧪 Database tables (Supabase)

### `topics`

| Column     | Type        |
| ---------- | ----------- |
| id         | integer     |
| title      | text        |
| user_id    | uuid        |
| created_at | timestamptz |

### `subtopics`

| Column    | Type    |
| --------- | ------- |
| id        | integer |
| title     | text    |
| topic_id  | integer |
| user_id   | uuid    |
| completed | boolean |
| url       | text    |
| content   | text    |

---

## 📌 Roadmap

- [ ] Tags support per topic
- [ ] Filter by completed / pending topics
- [ ] Image uploads for subtopics

---

## 🧑‍💻 Author

Made with ❤️ by [Your Name](https://github.com/your-username)

---

## 📄 License

This project is licensed under the MIT License.
