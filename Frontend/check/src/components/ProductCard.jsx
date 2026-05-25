import { Edit3, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useToast } from '../hooks/useToast.js';
import { imageUrl } from '../services/api.js';
import { formatPrice } from '../utils/format.js';
import { productImageProps } from '../utils/image.js';

export default function ProductCard({ product, onDelete }) {
  const { addToCart, getItemQuantity } = useCart();
  const { notify } = useToast();
  const cartQuantity = getItemQuantity(product.id);
  const isOutOfStock = !product.available || product.quantity === 0;
  const reachedStockLimit = cartQuantity >= product.quantity;

  const addProduct = () => {
    if (addToCart(product)) {
      notify(`${product.name} added to cart`, 'success');
      return;
    }

    notify(`Only ${product.quantity} units available for ${product.name}`, 'error');
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-wrap" aria-label={`Open ${product.name}`}>
        <img loading="lazy" alt={product.name} {...productImageProps(imageUrl(product))} />
        <span className={`availability ${product.available ? 'in-stock' : 'out-stock'}`}>{product.available ? 'Available' : 'Unavailable'}</span>
      </Link>
      <div className="product-card-body">
        <div>
          <p className="eyebrow">{product.brand}</p>
          <Link to={`/products/${product.id}`} className="product-title">
            {product.name}
          </Link>
          <p className="muted">{product.category}</p>
        </div>
        <div className="product-card-meta">
          <strong>{formatPrice(product.price)}</strong>
          <span>{product.quantity} in stock</span>
        </div>
        <div className={`card-actions ${onDelete ? '' : 'no-delete'}`}>
          <button className="button primary" type="button" disabled={isOutOfStock || reachedStockLimit} onClick={addProduct}>
            <ShoppingCart size={17} /> {reachedStockLimit ? 'Max' : 'Add'}
          </button>
          <Link className="icon-button" to={`/products/${product.id}/edit`} aria-label={`Edit ${product.name}`} title="Edit product">
            <Edit3 size={17} />
          </Link>
          {onDelete ? (
            <button className="icon-button danger" type="button" aria-label={`Delete ${product.name}`} title="Delete product" onClick={() => onDelete(product)}>
              <Trash2 size={17} />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
