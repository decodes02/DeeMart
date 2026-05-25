import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import ProductEditorPage from './pages/ProductEditorPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="products/new" element={<ProductEditorPage mode="create" />} />
        <Route path="products/:id/edit" element={<ProductEditorPage mode="edit" />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout/payment" element={<PaymentPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
