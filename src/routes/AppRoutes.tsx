
import { Routes, Route } from 'react-router-dom';
import Index from '../pages/Index';
import CategoryPage from '../pages/CategoryPage';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/category/:category" element={<CategoryPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
