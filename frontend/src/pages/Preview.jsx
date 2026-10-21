import { useEffect, useState } from 'react';
import Pagination from '../components/Pagination.jsx';
import { PREVIEW_PER_PAGE, STATUS } from '../constants/article.js';
import { listArticles } from '../services/articleApi.js';

export default function Preview() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    listArticles({ limit: PREVIEW_PER_PAGE, offset: (page - 1) * PREVIEW_PER_PAGE, status: STATUS.PUBLISH })
      .then((data) => { if (!ignore) { setItems(data.items); setTotal(data.total); setError(''); } })
      .catch((e) => { if (!ignore) setError(e.message); });
    return () => { ignore = true; };
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / PREVIEW_PER_PAGE));

  return (
    <>
      <h1>Preview</h1>
      {error && <p className="alert">{error}</p>}
      <div className="blog">
        {items.map((article) => (
          <article key={article.id} className="post">
            <span className="post-category">{article.category}</span>
            <h2>{article.title}</h2>
            <p>{article.content}</p>
          </article>
        ))}
        {!items.length && !error && <p className="empty">No published posts.</p>}
        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
      </div>
    </>
  );
}
