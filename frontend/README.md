# InkIT Blog — Frontend

A React-based frontend for the InkIT Blog platform.

## Tech Stack

- **Framework**: React 18
- **Routing**: React Router v7
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Styling**: Tailwind CSS
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── RootLayout.jsx        # App shell with navbar
│   │   ├── Home.jsx              # Public home / article listing
│   │   ├── Login.jsx             # Login page
│   │   ├── Register.jsx          # Register page
│   │   ├── ProtectedRoute.jsx    # Role-based route guard
│   │   ├── Unauthorized.jsx      # 403 page
│   │   ├── UserDashboard.jsx     # User dashboard
│   │   ├── AuthorDashboard.jsx   # Author dashboard layout
│   │   ├── AuthorArticles.jsx    # Author's article list
│   │   ├── AddArticle.jsx        # Create new article
│   │   ├── EditArticle.jsx       # Edit existing article
│   │   ├── ArticleById.jsx       # Article detail + comments
│   │   └── AdminDashboard.jsx    # Admin dashboard
│   ├── store/
│   │   └── authStore.js          # Zustand auth store
│   └── App.jsx                   # Router configuration
```

## Roles

| Role | Capabilities |
|------|-------------|
| **USER** | Browse articles, add comments |
| **AUTHOR** | Create, edit, delete/restore own articles |
| **ADMIN** | View all articles, block/unblock users |

## Environment Variables

Create a `.env` file in the root of the frontend folder:

```env
VITE_API_URL=https://your-backend.onrender.com
```

## Getting Started

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build
```

## Deployment

Deployed on **Vercel**.
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL` = your Render backend URL