import { Router } from 'express';
import * as repo from './articleRepository.js';
import { STATUSES, validateArticle } from './articleValidator.js';

const router = Router();

const badRequest = (res, errors) => res.status(400).json({ message: 'Validation failed', errors });
const notFound = (res) => res.status(404).json({ message: 'Article not found' });

const toInt = (value) => (/^\d+$/.test(value) ? Number(value) : NaN);

// GET /article/:limit/:offset?status=publish|draft|thrash
router.get('/:limit/:offset', (req, res) => {
  const limit = toInt(req.params.limit);
  const offset = toInt(req.params.offset);
  const { status } = req.query;

  if (Number.isNaN(limit) || Number.isNaN(offset) || limit < 1) {
    return badRequest(res, { limit: 'limit must be >= 1', offset: 'offset must be >= 0' });
  }
  if (status !== undefined && !STATUSES.includes(status)) {
    return badRequest(res, { status: `status must be one of: ${STATUSES.join(', ')}` });
  }

  res.set('X-Total-Count', String(repo.count(status)));
  res.json(repo.list({ limit, offset, status }));
});

// GET /article/:id
router.get('/:id', (req, res) => {
  const article = repo.find(toInt(req.params.id));
  return article ? res.json(article) : notFound(res);
});

// POST /article
router.post('/', (req, res) => {
  const { value, errors } = validateArticle(req.body);
  if (Object.keys(errors).length) return badRequest(res, errors);
  res.status(201).json(repo.create(value));
});

// PUT|PATCH /article/:id — field yang tidak dikirim tetap memakai nilai lama
const updateArticle = (req, res) => {
  const id = toInt(req.params.id);
  const current = repo.find(id);
  if (!current) return notFound(res);

  const { value, errors } = validateArticle({ ...current, ...req.body });
  if (Object.keys(errors).length) return badRequest(res, errors);
  res.json(repo.update(id, value));
};
router.put('/:id', updateArticle);
router.patch('/:id', updateArticle);

// DELETE /article/:id
router.delete('/:id', (req, res) =>
  repo.remove(toInt(req.params.id)) ? res.status(204).end() : notFound(res)
);

export default router;
