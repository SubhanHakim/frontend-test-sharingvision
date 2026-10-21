import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArticleForm from '../components/ArticleForm.jsx';
import { getArticle, updateArticle } from '../services/articleApi.js';

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getArticle(id).then(setArticle).catch((e) => setError(e.message));
  }, [id]);

  const handleSubmit = async (changes) => {
    await updateArticle(id, changes);
    navigate('/posts');
  };

  if (error) return <p className="alert">{error}</p>;
  if (!article) return <p>Loading...</p>;

  return (
    <>
      <h1>Edit Article</h1>
      <ArticleForm initial={article} onSubmit={handleSubmit} />
    </>
  );
}
