const BASE_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8081'}/article`;

export class ApiError extends Error {
  constructor(message, fieldErrors = {}) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

// Mendukung dua format validasi: ["title: pesan", ...] dan { title: "pesan" }
const parseFieldErrors = (errors) => {
  if (!Array.isArray(errors)) return errors ?? {};
  return Object.fromEntries(
    errors.map((entry) => {
      const i = entry.indexOf(': ');
      return i < 0 ? ['form', entry] : [entry.slice(0, i), entry.slice(i + 2)];
    })
  );
};

const request = async (path, options) => {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError('Tidak dapat terhubung ke server');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error ?? body.message ?? 'Terjadi kesalahan', parseFieldErrors(body.errors));
  }
  return res;
};

const withBody = (method, body) => ({ method, body: JSON.stringify(body) });

export const listArticles = async ({ limit, offset, status }) => {
  const res = await request(`/${limit}/${offset}?status=${status}`);
  return { items: await res.json(), total: Number(res.headers.get('X-Total-Count')) };
};

export const getArticle = async (id) => (await request(`/${id}`)).json();

export const createArticle = (article) => request('/', withBody('POST', article));

export const updateArticle = (id, changes) => request(`/${id}`, withBody('PUT', changes));

export const deleteArticle = (id) => request(`/${id}`, { method: 'DELETE' });
