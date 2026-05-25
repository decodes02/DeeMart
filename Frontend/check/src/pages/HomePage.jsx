import { ArrowRight, BarChart3, PackagePlus, ShoppingBag, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { getApiErrorMessage, productApi } from '../services/api.js';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    productApi
      .list()
      .then(setProducts)
      .catch((errorValue) => setError(getApiErrorMessage(errorValue, 'Unable to load products')))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const categories = new Set(products.map((product) => product.category));
    const inventory = products.reduce((sum, product) => sum + product.quantity, 0);
    return { categories: categories.size, inventory };
  }, [products]);

  return (
    <div className="page">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Full-stack product operations</p>
          <h1>Manage a dynamic e-commerce catalog with image-backed inventory.</h1>
          <p>DeeMart connects a Spring Boot product API, MySQL persistence, BLOB image retrieval, and React Context cart state in one interview-ready workflow.</p>
          <div className="hero-actions">
            <Link className="button primary large" to="/products">
              <ShoppingBag size={18} /> Browse catalog
            </Link>
            <Link className="button secondary large" to="/products/new">
              <PackagePlus size={18} /> Add product
            </Link>
          </div>
        </div>
        <div className="hero-metrics" aria-label="Catalog metrics">
          <div>
            <Sparkles size={22} />
            <strong>{products.length}</strong>
            <span>Products</span>
          </div>
          <div>
            <BarChart3 size={22} />
            <strong>{stats.categories}</strong>
            <span>Categories</span>
          </div>
          <div>
            <ShoppingBag size={22} />
            <strong>{stats.inventory}</strong>
            <span>Units</span>
          </div>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow">Featured inventory</p>
          <h2>Recently stocked products</h2>
        </div>
        <Link className="text-link" to="/products">
          View all <ArrowRight size={17} />
        </Link>
      </section>

      {loading && <LoadingSkeleton count={4} />}
      {error && <div className="alert error">{error}</div>}
      {!loading && !error && (
        <div className="product-grid compact-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}