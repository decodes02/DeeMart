import { ArrowLeft, Edit3, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useToast } from '../hooks/useToast.js';
import { getApiErrorMessage, imageUrl, productApi } from '../services/api.js';
import { formatDate, formatPrice } from '../utils/format.js';
import { productImageProps } from '../utils/image.js';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart, getItemQuantity } = useCart();
  const { notify } = useToast();

  useEffect(() => {
    productApi
      .get(id)
      .then(setProduct)
      .catch((errorValue) => setError(getApiErrorMessage(errorValue, 'Unable to load product')))
      .finally(() => setLoading(false));
  }, [id]);

  const deleteProduct = async () => {
    const confirmed = window.confirm(`Delete ${product.name}? This action cannot be undone.`);
    if (!confirmed) return;
    try {
      await productApi.remove(product.id);
      notify(`${product.name} deleted`, 'success');
      navigate('/products');
    } catch (errorValue) {
      notify(getApiErrorMessage(errorValue, 'Unable to delete product'), 'error');
    }
  };

  if (loading) {
    return <div className="page"><div className="detail-skeleton" /></div>;
  }

  if (error) {
    return <div className="page"><div className="alert error">{error}</div></div>;
  }

  const cartQuantity = getItemQuantity(product.id);
  const reachedStockLimit = cartQuantity >= product.quantity;

  const addProduct = () => {
    if (addToCart(product)) {
      notify(`${product.name} added to cart`, 'success');
      return;
    }

    notify(`Only ${product.quantity} units available for ${product.name}`, 'error');
  };

  return (
    <div className="page">
      <Link className="text-link back-link" to="/products">
        <ArrowLeft size={18} /> Back to products
      </Link>
      <section className="detail-layout">
        <div className="detail-image">
          <img alt={product.name} {...productImageProps(imageUrl(product))} />
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{product.brand}</p>
          <h1>{product.name}</h1>
          <p className="detail-description">{product.description}</p>
          <div className="detail-price">{formatPrice(product.price)}</div>
          <div className="detail-stats">
            <span>{product.category}</span>
            <span>{product.quantity} in stock</span>
            <span>Released {formatDate(product.releaseDate)}</span>
          </div>
          <div className="detail-actions">
            <button className="button primary large" disabled={!product.available || product.quantity === 0 || reachedStockLimit} type="button" onClick={addProduct}>
              <ShoppingCart size={18} /> {reachedStockLimit ? 'Stock limit reached' : 'Add to cart'}
            </button>
            <Link className="button secondary large" to={`/products/${product.id}/edit`}>
              <Edit3 size={18} /> Edit
            </Link>
            <button className="button danger large" type="button" onClick={deleteProduct}>
              <Trash2 size={18} /> Delete
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
