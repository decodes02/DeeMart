import { CreditCard, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import { useCart } from '../hooks/useCart.js';
import { imageUrl } from '../services/api.js';
import { formatPrice } from '../utils/format.js';
import { productImageProps } from '../utils/image.js';

export default function CartPage() {
  const { items, subtotal, totalItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  return (
    <div className="page">
      <section className="page-header row-header">
        <div>
          <p className="eyebrow">Context API state</p>
          <h1>Shopping cart</h1>
          <p>Cart state persists in localStorage and is shared globally through React Context.</p>
        </div>
        {items.length > 0 && <button className="button secondary" type="button" onClick={clearCart}>Clear cart</button>}
      </section>

      {items.length === 0 ? (
        <EmptyState title="Your cart is empty" message="Browse products and add items to see the cart workflow." />
      ) : (
        <section className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <img alt={item.name} {...productImageProps(imageUrl(item))} />
                <div>
                  <p className="eyebrow">{item.brand}</p>
                  <Link className="product-title" to={`/products/${item.id}`}>{item.name}</Link>
                  <p className="muted">{formatPrice(item.price)}</p>
                </div>
                <div className="quantity-control">
                  <button type="button" aria-label="Decrease quantity" onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}><Minus size={16} /></button>
                  <span>{item.cartQuantity}</span>
                  <button type="button" aria-label="Increase quantity" disabled={item.cartQuantity >= item.quantity} onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}><Plus size={16} /></button>
                </div>
                <strong>{formatPrice(Number(item.price) * item.cartQuantity)}</strong>
                <button className="icon-button danger" type="button" aria-label={`Remove ${item.name}`} onClick={() => removeFromCart(item.id)}>
                  <Trash2 size={17} />
                </button>
              </article>
            ))}
          </div>
          <aside className="cart-summary">
            <h2>Order summary</h2>
            <dl>
              <div><dt>Items</dt><dd>{totalItems}</dd></div>
              <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
              <div><dt>Estimated tax</dt><dd>{formatPrice(tax)}</dd></div>
              <div className="total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
            </dl>
            <Link className="button primary large full" to="/products">
              <ShoppingBag size={18} /> Continue shopping
            </Link>
            <Link className="button dark large full" to="/checkout">
              <CreditCard size={18} /> Add address & order
            </Link>
          </aside>
        </section>
      )}
    </div>
  );
}
