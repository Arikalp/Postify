# Mini Project 1 - Social Media App

A simple social media application built with Node.js, Express, MongoDB, and EJS.

## Features

- User registration and authentication
- User profiles
- Create, delete, and like posts
- JWT-based authentication with cookies

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   MONGODB_URI=mongodb+srv://sankalpkrsaini:06nFwURc4rNOkBPN@postify.hzcjpkr.mongodb.net/?retryWrites=true&w=majority&appName=postify
   JWT_SECRET=your_secret_key
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Vercel Deployment

### Prerequisites

1. **MongoDB Atlas Account**: You need a MongoDB Atlas cluster since Vercel doesn't support local MongoDB.

2. **Environment Variables**: Set these in your Vercel project settings:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `NODE_ENV`: Set to `production`

### Deployment Steps

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect the Node.js project
   - Set the environment variables in Vercel dashboard
   - Deploy!

### Important Notes

- The app will automatically use the `PORT` environment variable set by Vercel
- MongoDB connection is handled through environment variables
- Static files are served from the `public` directory
- EJS templates are rendered server-side

## Project Structure

```
├── app.js              # Main application file
├── models/             # MongoDB models
│   ├── user.js        # User model
│   └── post.js        # Post model
├── views/              # EJS templates
├── public/             # Static assets
├── vercel.json         # Vercel configuration
└── package.json        # Dependencies and scripts
```

## Dependencies

- **Express**: Web framework
- **Mongoose**: MongoDB ODM
- **EJS**: Template engine
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cookie-parser**: Cookie parsing middleware
