# PrepMate: Comprehensive Technical Documentation

## Table of Contents
1. Introduction
2. Project Overview
3. System Architecture
4. Technology Stack
5. Database Design
6. Backend Architecture
7. API Endpoints
8. Frontend Architecture
9. User Flows
10. AI Integration
11. Security Considerations
12. Deployment & DevOps
13. Testing & Quality Assurance
14. Performance Optimization
15. Accessibility & UX
16. Future Roadmap
17. Appendices

---

## 1. Introduction
PrepMate is an advanced educational platform designed to empower learners and educators by providing AI-driven course and study material generation, personalized progress tracking, and interactive learning modules. This documentation provides an in-depth analysis of the PrepMate codebase, its architectural decisions, and implementation details.

## 2. Project Overview
PrepMate allows users to:
- Generate and enroll in AI-powered courses
- Access detailed notes and quizzes
- Track learning progress
- Manage user profiles
- Leverage AI for content generation (notes, quizzes, flashcards)

The platform is built with Next.js, utilizing both server-side and client-side rendering, and integrates with AI services for dynamic content creation.

## 3. System Architecture
### 3.1 High-Level Diagram
```
[User] ⇄ [Next.js Frontend] ⇄ [API Routes] ⇄ [Database]
                                    ↓
                                [AI Services]
```
### 3.2 Component Layers
- Presentation Layer: React/Next.js components
- API Layer: Next.js API routes
- Data Layer: Drizzle ORM, PostgreSQL
- AI Layer: Google Generative AI Integration

## 4. Technology Stack
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API Routes, Node.js
- **Database:** PostgreSQL, Drizzle ORM
- **AI Integration:** Google Generative AI (Gemini)
- **Authentication:** Clerk
- **DevOps:** Vercel/Netlify, GitHub Actions

## 5. Database Design
### 5.1 Entity-Relationship Diagram
- **USER_TABLE**: Stores user profiles
- **STUDY_MATERIAL_TABLE**: Stores course metadata
- **CHAPTER_NOTES_TABLE**: Stores chapter-wise notes
- **STUDY_TYPE_CONTENT_TABLE**: Stores content for different study types (e.g., flashcards, quizzes)

### 5.2 Table Schemas
#### USER_TABLE
| Field     | Type    | Description              |
|-----------|---------|-------------------------|
| id        | serial  | Primary Key             |
| name      | text    | User name               |
| email     | text    | User email (unique)     |
| isMember  | boolean | Membership status       |

#### STUDY_MATERIAL_TABLE
| Field         | Type    | Description           |
|--------------|---------|----------------------|
| id           | serial  | Primary Key          |
| courseId     | varchar | Unique course ID     |
| courseType   | varchar | Course type          |
| topic        | varchar | Course topic         |
| difficulty   | varchar | Difficulty level     |
| courseLayout | json    | Course structure     |
| createdBy    | varchar | Creator (user)       |
| status       | varchar | Generation status    |

#### CHAPTER_NOTES_TABLE
| Field     | Type    | Description           |
|-----------|---------|----------------------|
| id        | serial  | Primary Key          |
| courseId  | varchar | Related course ID    |
| chapterId | varchar | Chapter identifier   |
| notes     | text    | Notes content        |

#### STUDY_TYPE_CONTENT_TABLE
| Field     | Type    | Description           |
|-----------|---------|----------------------|
| id        | serial  | Primary Key          |
| courseId  | varchar | Related course ID    |
| content   | json    | Study type content   |
| type      | varchar | Content type         |
| status    | varchar | Generation status    |

## 6. Backend Architecture
### 6.1 API Structure
- API routes under `/app/api/` handle:
  - Course creation and retrieval
  - Notes and quiz generation
  - User management
  - Study type content (flashcards, quizzes)

### 6.2 Data Access Layer
- Uses Drizzle ORM for type-safe database interaction
- Connection management via `configs/db.js`
- Error handling and mock DB fallback for development

## 7. API Endpoints
### 7.1 Course Endpoints
- `POST /api/courses` – Get courses by user
- `GET /api/courses?courseId=...` – Get course details

### 7.2 Notes Generation
- `POST /api/generate-notes` – Triggers AI notes generation for a course

### 7.3 Study Type Content
- `POST /api/study-type` – Generates quizzes or flashcards

### 7.4 User Endpoints
- `GET /api/user` – Returns user profile
- `GET /api/user-courses-count` – Returns number of courses generated/enrolled

### 7.5 Error Handling
- All endpoints return descriptive error messages and status codes

## 8. Frontend Architecture
### 8.1 Next.js Structure
- `/app` – Main application directory
- `/app/course/[courseId]` – Dynamic course pages
- `/app/course/[courseId]/quiz` – Quiz component and logic
- `/app/course/[courseId]/notes` – Notes viewing
- `/app/course/[courseId]/flashcards` – Flashcards UI
- `/app/profile` – User profile page

### 8.2 Key Components
- `QuizCardItem.jsx` – Interactive quiz card
- `ChapterSidebar.jsx` – Sidebar navigation for chapters
- `StudyMaterialSection.jsx` – Main study material display
- `FlashcardItem.jsx` – Flashcard UI logic

### 8.3 State Management
- Uses React hooks and local state
- Caching with localStorage for course data

### 8.4 Styling
- Tailwind CSS for consistent theming
- Responsive design for mobile/desktop

## 9. User Flows
### 9.1 Course Generation
1. User requests new course
2. AI generates course outline and structure
3. User views and enrolls in course

### 9.2 Notes & Quiz Generation
1. User triggers notes/quiz generation
2. AI produces content and stores in DB
3. User accesses notes/quizzes via UI

### 9.3 Progress Tracking
- Progress tracked per user and course
- Displayed on profile and course pages

### 9.4 Profile Management
- Users can view email, join date, course stats

## 10. AI Integration
### 10.1 Google Generative AI (Gemini)
- Integrated via `@google/generative-ai` SDK
- Prompts tailored for:
  - Course outline
  - Chapter notes
  - Quizzes
  - Flashcards
- Handles rate limiting, retries, and prompt engineering

### 10.2 Prompt Templates
- Detailed, context-specific prompts for high-quality content
- Example: "Generate comprehensive exam material and detailed notes..."

## 11. Security Considerations
- Uses Clerk for authentication and session management
- Environment variables for sensitive keys
- Input validation on all endpoints
- Error logging and handling
- Rate limiting for AI requests

## 12. Deployment & DevOps
- Next.js app deployable on Vercel, Netlify
- GitHub Actions for CI/CD
- Environment-specific configs
- Automated build, test, and deploy pipelines

## 13. Testing & Quality Assurance
- Unit tests for key components (planned/partial)
- Manual and automated UI tests
- Linting with Next.js and Tailwind
- Error monitoring and logging

## 14. Performance Optimization
- SSR and SSG for fast page loads
- Caching strategies for API and static assets
- Optimized AI calls to minimize latency

## 15. Accessibility & UX
- WCAG-compliant color schemes
- Keyboard navigation support
- Responsive layouts
- ARIA labels and semantic HTML

## 16. Future Roadmap
- Expand AI content types (videos, summaries)
- Advanced analytics for learners
- Community features (forums, peer review)
- Mobile app
- Enhanced gamification

## 17. Appendices
### Appendix A: Example API Request/Response
### Appendix B: Sample Database Records
### Appendix C: Environment Variables
### Appendix D: Glossary
### Appendix E: References

---

*This document is auto-generated and should be reviewed for accuracy and completeness before publication. For detailed code-level documentation, refer to the inline comments and README.md.*
