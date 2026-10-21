import { useNavigate } from 'react-router-dom';
import ArticleForm from '../components/ArticleForm.jsx';
import { createArticle } from '../services/articleApi.js';

export default function AddNew() {
  const navigate = useNavigate();

  const handleSubmit = async (article) => {
    await createArticle(article);
    navigate('/posts');
  };

  return (
    <>
      <h1>Add New</h1>
      <ArticleForm onSubmit={handleSubmit} />
    </>
  );
}
