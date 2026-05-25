import { PackagePlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductFilters from '../components/ProductFilters.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { useToast } from '../hooks/useToast.js';
import { getApiErrorMessage, productApi } from '../services/api.js';

const defaultFilters = {
  keyword: '',
  category: 'all',
  sortBy: 'featured',
  availableOnly: false,
};

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ ...defaultFilters, keyword: searchParams.get('q') ?? '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const debouncedKeyword = useDebounce(filters.keyword);
  const { notify } = useToast();

  useEffect(() => {
    setFilters((current) => ({ ...current, keyword: searchParams.get('q') ?? current.keyword }));
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setError('');
    const request = debouncedKeyword ? productApi.search(debouncedKeyword) : productApi.list();
    request
      .then(setProducts)
      .catch((errorValue) => setError(getApiErrorMessage(errorValue, 'Unable to load products')))
      .finally(() => setLoading(false));
  }, [debouncedKeyword]);

  const categories = useMemo(() => [...new Set(products.map((product) => product.category))].sort(), [products]);

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = filters.category === 'all' || product.category === filters.category;
      const matchesAvailability = !filters.availableOnly || (product.available && product.quantity > 0);
      return matchesCategory && matchesAvailability;
    });

    return [...filtered].sort((first, second) => {
      if (filters.sortBy === 'priceAsc') return Number(first.price) - Number(second.price);
      if (filters.sortBy === 'priceDesc') return Number(second.price) - Number(first.price);
      if (filters.sortBy === 'nameAsc') return first.name.localeCompare(second.name);
      if (filters.sortBy === 'newest') return new Date(second.releaseDate) - new Date(first.releaseDate);
      return first.id - second.id;
    });
  }, [filters, products]);

  const deleteProduct = async (product) => {
    const confirmed = window.confirm(`Delete ${product.name}? This action cannot be undone.`);
    if (!confirmed) return;
    try {
      await productApi.remove(product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
      notify(`${product.name} deleted`, 'success');
    } catch (errorValue) {
      notify(getApiErrorMessage(errorValue, 'Unable to delete product'), 'error');
    }
  };

  return (
    <div className="page">
      <section className="page-header row-header">
        <div>
          <p className="eyebrow">Catalog control</p>
          <h1>Product inventory</h1>
          <p>Search, filter, sort, edit, and publish the products served by the Spring Boot API.</p>
        </div>
        <Link className="button primary" to="/products/new">
          <PackagePlus size={18} /> Add product
        </Link>
      </section>

      <ProductFilters filters={filters} categories={categories} onChange={setFilters} />

      {loading && <LoadingSkeleton />}
      {error && <div className="alert error">{error}</div>}
      {!loading && !error && visibleProducts.length === 0 && <EmptyState title="No products found" message="Try a different search term or add a new catalog item." />}
      {!loading && !error && visibleProducts.length > 0 && (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onDelete={deleteProduct} />
          ))}
        </div>
      )}
    </div>
  );
}
