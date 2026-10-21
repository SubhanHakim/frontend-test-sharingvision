import { useNavigate } from 'react-router-dom';
import ArticleForm from '../components/ArticleForm.jsx';
import { createArticle } from '../services/articleApi.js';

export default function AddNew() {
  const navigate = useNavigate();

  const handleSubmit = async (article) => {
    try {
      await createArticle(article);
      navigate('/posts');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <>
      <h1>Add New</h1>
      <ArticleForm onSubmit={handleSubmit} />
    </>
  );
}
