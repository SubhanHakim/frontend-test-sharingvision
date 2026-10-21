import { STATUS } from '../constants/article.js';

export default function ArticleForm({ initial, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    onSubmit({
      title: data.get('title').trim(),
      content: data.get('content').trim(),
      category: data.get('category').trim(),
      status: e.nativeEvent.submitter.value,
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="field">
        Title
        <input name="title" defaultValue={initial?.title} required />
      </label>
      <label className="field">
        Content
        <textarea name="content" defaultValue={initial?.content} required />
      </label>
      <label className="field">
        Category
        <input name="category" defaultValue={initial?.category} required />
      </label>
      <div className="form-actions">
        <button className="btn btn-primary" value={STATUS.PUBLISH}>Publish</button>
        <button className="btn" value={STATUS.DRAFT}>Draft</button>
      </div>
    </form>
  );
}
