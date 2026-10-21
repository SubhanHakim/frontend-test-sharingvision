export const STATUSES = ['publish', 'draft', 'thrash'];

const TEXT_FIELDS = ['title', 'content', 'category'];

// Mengembalikan { value, errors }; errors kosong berarti valid.
export const validateArticle = (body = {}) => {
  const errors = {};
  const value = { status: body.status ?? 'draft' };

  for (const field of TEXT_FIELDS) {
    const text = typeof body[field] === 'string' ? body[field].trim() : '';
    if (!text) errors[field] = `${field} is required`;
    value[field] = text;
  }
  if (!STATUSES.includes(value.status)) {
    errors.status = `status must be one of: ${STATUSES.join(', ')}`;
  }

  return { value, errors };
};
