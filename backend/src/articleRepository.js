import db from './db.js';

const FIELDS = 'id, title, content, category, status, created_date, updated_date';

// status null = semua status
export const list = ({ limit, offset, status = null }) =>
  db
    .prepare(
      `SELECT ${FIELDS} FROM posts
       WHERE (? IS NULL OR status = ?)
       ORDER BY id DESC LIMIT ? OFFSET ?`
    )
    .all(status, status, limit, offset);

export const count = (status = null) =>
  db.prepare('SELECT COUNT(*) AS total FROM posts WHERE (? IS NULL OR status = ?)').get(status, status).total;

export const find = (id) => db.prepare(`SELECT ${FIELDS} FROM posts WHERE id = ?`).get(id);

export const create = ({ title, content, category, status }) => {
  const { lastInsertRowid } = db
    .prepare('INSERT INTO posts (title, content, category, status) VALUES (?, ?, ?, ?)')
    .run(title, content, category, status);
  return find(lastInsertRowid);
};

export const update = (id, { title, content, category, status }) => {
  db.prepare(
    `UPDATE posts SET title = ?, content = ?, category = ?, status = ?, updated_date = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).run(title, content, category, status, id);
  return find(id);
};

export const remove = (id) => db.prepare('DELETE FROM posts WHERE id = ?').run(id).changes > 0;
