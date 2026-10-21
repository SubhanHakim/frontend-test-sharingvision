const BASE_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8080'}/article`;

const request = async (path, options) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? res.statusText);
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
