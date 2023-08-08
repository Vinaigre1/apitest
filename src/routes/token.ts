import express, { Request, Response } from 'express';
import { User } from '../types';
import { Database } from 'sqlite3';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const router = express.Router();

export default function(db: Database, jwt_secret: string) {
  router.post('/', (req: Request, res: Response) => {
    const { email, password } = req.body;

    db.all('SELECT * FROM users WHERE email = ?', [email], (err, rows: User[]) => {
      if (err) {
        res.status(500);
        res.response.success = false;
        res.response.errors.push(err.message);
        res.sendJson();
        return;
      }
      if (rows.length === 0) {
        res.status(401);
        res.response.success = false;
        res.response.errors.push('Incorrect user');
        res.sendJson();
        return;
      }

      const md5Hash = crypto.createHash('md5');

      // In a normal environment, only 1 row can be returned at most.
      const user: User = rows[0];

      const password_hash = md5Hash.update(user?.id + '' + password).digest('hex');

      db.all('SELECT * FROM users WHERE email = ? AND password_hash = ?', [email, password_hash], (err, rows: User[]) => {
        if (err) {
          res.status(500);
          res.response.success = false;
          res.response.errors.push(err.message);
          res.sendJson();
          return;
        }
        if (rows.length === 0) {
          res.status(401);
          res.response.success = false;
          res.response.errors.push('Incorrect user');
          res.sendJson();
          return;
        }

        // In a normal environment, only 1 row can be returned at most.
        const user: User = rows[0];

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, jwt_secret);

        res.response.data = { token };
        res.sendJson();
      });
    });
  });

  return router;
}
