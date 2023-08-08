import express, { NextFunction, Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import jwt from 'jsonwebtoken';

import tokenRoutes from './routes/token';
import productsRoutes from './routes/products';
import categoriesRoutes from './routes/categories';
import cartRoutes from './routes/cart';

const app = express();
const port = 3000;

// Create a database connection
const dbPath = path.resolve(__dirname, '../DATABASE.sqlite');
const db = new sqlite3.Database(dbPath);

// Secret token, should not be in versioning
const jwt_secret = 'vQAPN5ChMFvcXJjFPUtHQ0bVVhKtO3oPKxipcw53Ivepoj7qvxvKnbuO1UNBahA';

app.use(express.json());

// Create custom send function to always return the same response format
app.use((req: Request, res: Response, next: NextFunction) => {
  res.response = {
    data: null,
    success: true,
    warnings: [],
    errors: []
  };
  res.sendJson = function(): Response {
    return this.json(res.response);
  }
  next();
});

// Manages user connection
app.use((req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer" header

  if (!token) {
    next();
    return;
  }

  jwt.verify(token, jwt_secret, (err, user) => {
    // If error, do as if there was no token
    if (err) {
      next();
      return;
    }
    // User is authenticated
    req.user = user;
    next();
  });
})

// Get products
app.use('/products', productsRoutes(db));

// Get categories
app.use('/categories', categoriesRoutes(db));

// Request token
app.use('/token', tokenRoutes(db, jwt_secret));

// Get current user cart
app.use('/cart', cartRoutes(db));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
