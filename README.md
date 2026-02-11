### Backend development
1.create git repo
git init
2.add .gitignore 
3. create .env file for environment variables & read data from .env with dotenv
4.generate package.json
5.CREATE Express app
6.connect to database
7. Add middleware (body parser,err habdling )
8.Design Schema  and create models 
9.Design REST APIs for all resources

=> backend can be used by some other applications as well , not only for the frontend  of this project 
the API's are very flexible such that it can be integrated with many other applications like java applications , mobile applications 
but only when the req and responses are same as per our backend. 

Blog Platform Backend – Role Based APIs 

This project is a backend REST API built using Node.js, Express, and MongoDB as part of training classes. It demonstrates authentication, authorization, and role-based access control for three types of users: User, Author, and Admin.

Features Implemented :

->User registration and login

->JWT-based authentication

->Role-based access (USER, AUTHOR, ADMIN)

->Password hashing using bcrypt

->Protected routes using middleware

->Author APIs to manage articles

->Admin APIs to manage users (block/unblock) and view articles

->Centralized error handling



Tech Stack Used:

Node.js

Express.js

MongoDB with Mongoose

JWT (JSON Web Token)

bcrypt

dotenv

Project Structure:
.
├── APIs
│   ├── CommonAPI.js
│   ├── UserAPI.js
│   ├── AuthorAPI.js
│   └── AdminAPI.js
├── middlewares
│   ├── verifyToken.js
│   └── checkAuthor.js
├── models
│   ├── UserTypeModel.js
│   └── ArticleModel.js
├── services
│   └── authservices.js
├── server.js
├── .env
├── .gitignore
└── package.json

Environment Setup:

Create a .env file in the root directory:

PORT=4000
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

API Endpoints Covered in Training :
Common APIs

POST /common-api/register

POST /common-api/login

User APIs

User profile related APIs

Author APIs

Create article

Update article

Delete article

Admin APIs

View all articles

Block user

Unblock user

How to Run the Project :

Install dependencies

npm install


Add .env file with required values

Start the server

npm start

