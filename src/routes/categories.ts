import express, { Request, Response } from 'express';
import { Category } from '../types';
import { Database } from 'sqlite3';

const router = express.Router();

export default function(db: Database) {
  router.get('/', (req: Request, res: Response) => {
    const { limit, from, sort, asc } = req.query;

    const fields = ['id', 'index', 'label', 'description'];

    const allowed_sort = ['index', 'label', 'description'];
    let sort_by = 'id';

    let sql = `SELECT \`${fields.join('`,`')}\` FROM categories`;
    const params: string[] = [];

    // Set sorting of output, defaults to id
    if (sort && allowed_sort.includes(sort as string)) {
      sort_by = `\`${sort as string}\``;
    } else if (sort) {
      res.response.warnings.push('Invalid value for parameter \'sort\'');
    }
    sql += ` ORDER BY ${sort_by}`; // Secure because Array.includes() does strict comparisons

    // Set sorting order, defaults to ascending
    if (asc === 'false' || asc === '0') {
      sql += ' DESC';
    } else {
      sql += ' ASC';
    }

    // Set limit of output, defaults to no limit
    if (limit) {
      sql += ' LIMIT ?';
      params.push(limit as string);

      // Set offset of output, defaults to no offset
      if (from) {
        sql += ' OFFSET ?';
        params.push(from as string);
      }
    } else if (from) {
      res.response.warnings.push('Parameter \'from\' is ignored when parameter \'limit\' is not present');
    }

    db.all(sql, params, (err, rows: Category[]) => {
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

  return router;
}
