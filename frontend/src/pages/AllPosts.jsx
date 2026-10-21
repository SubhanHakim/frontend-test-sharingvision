import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EditIcon, TrashIcon } from '../components/Icons.jsx';
import { DASHBOARD_LIMIT, STATUS, TABS } from '../constants/article.js';
import { deleteArticle, listArticles, updateArticle } from '../services/articleApi.js';

export default function AllPosts() {
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState(STATUS.PUBLISH);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    listArticles({ limit: DASHBOARD_LIMIT, offset: 0, status: activeStatus })
      .then(({ items }) => { if (!ignore) { setRows(items); setError(''); } })
      .catch((e) => { if (!ignore) setError(e.message); });
    return () => { ignore = true; };
  }, [activeStatus, reloadKey]);

  const handleTrash = async (article) => {
    try {
      if (activeStatus !== STATUS.TRASH) {
        await updateArticle(article.id, { status: STATUS.TRASH });
      } else if (confirm(`Hapus permanen "${article.title}"?`)) {
        await deleteArticle(article.id);
      } else {
        return;
      }
      setReloadKey((k) => k + 1);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h1>
        All Posts
        <Link to="/new" className="btn btn-sm">Add New</Link>
      </h1>
      <ul className="tabs">
        {TABS.map(({ status, label }) => (
          <li key={status}>
            <button className={activeStatus === status ? 'active' : ''} onClick={() => setActiveStatus(status)}>
              {label}
            </button>
          </li>
        ))}
      </ul>
      {error && <p className="alert">{error}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Title</th><th>Category</th><th className="col-action">Action</th></tr>
          </thead>
          <tbody>
            {rows.map((article) => (
              <tr key={article.id}>
                <td className="col-title">{article.title}</td>
                <td>{article.category}</td>
                <td className="col-action">
                  <div className="actions">
                    <button className="icon-btn" title="Edit" aria-label="Edit" onClick={() => navigate(`/edit/${article.id}`)}>
                      <EditIcon />
                    </button>
                    <button className="icon-btn trash" title="Trash" aria-label="Trash" onClick={() => handleTrash(article)}>
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan="3" className="empty">No posts found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
