import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import AddNew from './pages/AddNew.jsx';
import AllPosts from './pages/AllPosts.jsx';
import EditArticle from './pages/EditArticle.jsx';
import Preview from './pages/Preview.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/posts" element={<AllPosts />} />
        <Route path="/new" element={<AddNew />} />
        <Route path="/edit/:id" element={<EditArticle />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="*" element={<Navigate to="/posts" replace />} />
      </Route>
    </Routes>
  );
}
