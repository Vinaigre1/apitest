import express, { NextFunction, Request, Response } from 'express';
import { Cart, Category } from '../types';
import { Database } from 'sqlite3';
import { JwtPayload } from 'jsonwebtoken';

const router = express.Router();

export default function(db: Database) {
  router.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401);
      res.response.success = false;
      res.response.errors.push('Invalid user');
      res.sendJson();
      return;
    }
    next();
  });

  // Get user cart
  router.get('/', (req: Request, res: Response) => {
    const fields = ['id', 'product_id', 'quantity'];

    let sql = `SELECT \`${fields.join('`,`')}\` FROM carts WHERE \`user_id\` = ${(req.user as JwtPayload).id}`;
    const params: string[] = [];

    db.all(sql, params, (err, rows: Cart[]) => {
      if (err) {
        res.status(500);
        res.response.success = false;
        res.response.errors.push(err.message);
        res.sendJson();
        return;
      }
      res.response.data = rows;
      res.sendJson();
    });
  });

  // Add to user cart
  router.post('/add', (req: Request, res: Response) => {
    const { product, quantity = '1' } = req.body;

    if (!product) {
      console.log(product, quantity);
      res.status(400);
      res.response.success = false;
      res.response.errors.push('Parameter \`product\` is required.');
      res.sendJson();
      return;
    }

    let sql = `SELECT \`id\` FROM carts WHERE \`user_id\` = ${(req.user as JwtPayload).id} AND \`product_id\` = ?`;
    const params = [product];

    db.all(sql, params, (err, rows: Cart[]) => {
      if (err) {
        res.status(500);
        res.response.success = false;
        res.response.errors.push(err.message);
        res.sendJson();
        return;
      }
      let sql = '';
      const params = [];

      if (rows.length) { // Ignores invalid cases where multiple rows are returned
        if (quantity <= 0) {
          // Delete row if quantity is 0
          sql = `DELETE FROM carts WHERE \`id\` = ?`;
          params.push(rows[0].id);
        } else {
          // Update if row already exists
          sql = `UPDATE carts SET \`quantity\` = ? WHERE \`id\` = ?`;
          params.push(quantity, rows[0].id);
        }
      } else if (quantity > 0) {
        sql = `INSERT INTO carts (\`user_id\`, \`product_id\`, \`quantity\`) VALUES (?, ?, ?)`;
        params.push((req.user as JwtPayload).id, product, quantity);
      }

      if (sql === '') {
        res.sendJson();
        return;
      }
      db.run(sql, params, (err) => {
        if (err) {
          res.status(500);
          res.response.success = false;
          res.response.errors.push(err.message);
          res.sendJson();
          return;
        }
        res.sendJson();
      });
    });
  });

  return router;
}
