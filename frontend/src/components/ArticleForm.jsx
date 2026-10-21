import { useState } from 'react';
import { STATUS } from '../constants/article.js';

const FIELDS = ['title', 'content', 'category'];

// onSubmit(article) harus async dan melempar ApiError bila gagal.
export default function ArticleForm({ initial, onSubmit }) {
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const article = {
      title: data.get('title').trim(),
      content: data.get('content').trim(),
      category: data.get('category').trim(),
      status: e.nativeEvent.submitter.value,
    };

    setFieldErrors({});
    setMessage('');
    setSubmitting(true);
    try {
      await onSubmit(article);
    } catch (err) {
      const errors = err.fieldErrors ?? {};
      setFieldErrors(errors);
      // Error yang bukan milik field tertentu ditampilkan di atas form.
      const general = Object.entries(errors)
        .filter(([key]) => !FIELDS.includes(key))
        .map(([key, text]) => (key === 'form' ? text : `${key}: ${text}`));
      setMessage(general.length ? general.join(', ') : Object.keys(errors).length ? '' : err.message);
      setSubmitting(false);
    }
  };

  const field = (name, label, control) => (
    <label className="field">
      {label}
      {control}
      {fieldErrors[name] && <span className="field-error" role="alert">{fieldErrors[name]}</span>}
    </label>
  );

  const props = (name) => ({
    name,
    defaultValue: initial?.[name],
    required: true,
    'aria-invalid': Boolean(fieldErrors[name]),
  });

  return (
    <form className="form" onSubmit={handleSubmit}>
      {message && <p className="alert" role="alert">{message}</p>}
      {field('title', 'Title', <input {...props('title')} />)}
      {field('content', 'Content', <textarea {...props('content')} />)}
      {field('category', 'Category', <input {...props('category')} />)}
      <div className="form-actions">
        <button className="btn btn-primary" value={STATUS.PUBLISH} disabled={submitting}>Publish</button>
        <button className="btn" value={STATUS.DRAFT} disabled={submitting}>Draft</button>
      </div>
    </form>
  );
}
