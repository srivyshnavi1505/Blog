# InkIT Blog — Backend

A REST API for the InkIT Blog platform built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas) + Mongoose
- **Auth**: JWT (via httpOnly cookies)
- **File Upload**: Multer + Cloudinary
- **Password Hashing**: bcryptjs

## Project Structure

```
backend/
├── APIs/
│   ├── AdminAPI.js       # Admin routes (block/unblock users, view all articles)
│   ├── AuthorAPI.js      # Author routes (CRUD articles, register)
│   ├── CommonAPI.js      # Shared routes (login, logout, check-auth)
│   └── UserAPI.js        # User routes (view articles, add comments)
├── middlewares/
│   ├── verifyToken.js    # JWT verification middleware
│   └── checkAuthor.js    # Author role verification
├── models/
│   ├── UserTypeModel.js  # User schema (USER / AUTHOR / ADMIN)
│   └── ArticleModel.js   # Article schema
├── services/
│   └── authServices.js   # Register & authenticate logic
├── config/
│   ├── cloudinary.js
│   ├── cloudinaryUpload.js
│   └── multer.js
└── server.js
```

## API Routes

### Common (`/common-api`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/login` | Login with email & password |
| GET | `/logout` | Clear auth cookie |
| GET | `/check-auth` | Verify session (used on page refresh) |
| PUT | `/change-password` | Change user password |

### User (`/user-api`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/users` | Register as user |
| GET | `/articles` | Get all active articles |
| PUT | `/articles` | Add comment to article |

### Author (`/author-api`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/users` | Register as author |
| POST | `/articles` | Create article |
| GET | `/articles/:authorId` | Get author's articles |
| GET | `/article/:id` | Get single article |
| PUT | `/articles/:articleId` | Edit article |
| PATCH | `/articles/:id/status` | Soft delete / restore article |

### Admin (`/admin-api`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/articles` | Get all articles |
| PUT | `/block/:uid` | Block a user |
| PUT | `/unblock/:uid` | Unblock a user |

## Environment Variables

Create a `.env` file in the root of the backend folder:

```env
PORT=4000
DB_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

## Getting Started

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Run in production
npm start
```

## Deployment

Deployed on **Render** as a Web Service.
- Build command: `npm install`
- Start command: `node server.js`