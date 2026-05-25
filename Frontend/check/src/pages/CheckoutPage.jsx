import { ArrowLeft, MapPin, ShieldCheck, Truck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import { useCart } from '../hooks/useCart.js';
import { formatPrice } from '../utils/format.js';

const initialAddress = {
  fullName: '',
  phone: '',
  line1: '',
  city: '',
  state: '',
  zipCode: '',
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, totalItems } = useCart();
  const [address, setAddress] = useState(initialAddress);
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 12;
  const tax = subtotal * 0.0825;
  const total = subtotal + tax + shipping;

  const addressComplete = useMemo(
    () => Object.values(address).every((value) => value.trim().length > 0),
    [address],
  );

  const update = (name, value) => setAddress((current) => ({ ...current, [name]: value }));

  const submitOrder = (event) => {
    event.preventDefault();
    if (addressComplete) {
      navigate('/checkout/payment', { state: { address, total } });
    }
  };

  if (items.length === 0) {
    return (
      <div className="page narrow-page">
        <EmptyState title="No items to checkout" message="Add products to the cart before placing an order." />
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <Link className="text-link back-link" to="/cart">
        <ArrowLeft size={18} /> Back to cart
      </Link>

      <section className="page-header checkout-hero">
        <p className="eyebrow">Secure checkout</p>
        <h1>Address & order</h1>
        <p>Review the cart, add delivery details, and continue to a demo payment step.</p>
      </section>

      <section className="checkout-layout">
        <form className="product-form checkout-form" onSubmit={submitOrder}>
          <div className="checkout-step">
            <MapPin size={20} />
            <div>
              <h2>Delivery address</h2>
              <p className="muted">Use any demo address while testing the flow.</p>
            </div>
          </div>

          <div className="form-grid">
            <label>
              Full name
              <input required value={address.fullName} onChange={(event) => update('fullName', event.target.value)} />
            </label>
            <label>
              Phone
              <input required value={address.phone} onChange={(event) => update('phone', event.target.value)} />
            </label>
            <label className="wide-field">
              Address line
              <input required value={address.line1} onChange={(event) => update('line1', event.target.value)} />
            </label>
            <label>
              City
              <input required value={address.city} onChange={(event) => update('city', event.target.value)} />
            </label>
            <label>
              State
              <input required value={address.state} onChange={(event) => update('state', event.target.value)} />
            </label>
            <label>
              ZIP / PIN code
              <input required value={address.zipCode} onChange={(event) => update('zipCode', event.target.value)} />
            </label>
          </div>

          <div className="checkout-assurance">
            <span><Truck size={17} /> Fast delivery</span>
            <span><ShieldCheck size={17} /> Demo-safe payment</span>
          </div>

          <button className="button dark large full" type="submit" disabled={!addressComplete}>
            Continue to payment
          </button>
        </form>

        <aside className="cart-summary checkout-summary">
          <h2>Order review</h2>
          <div className="mini-cart">
            {items.map((item) => (
              <div key={item.id}>
                <span>{item.name}</span>
                <strong>{item.cartQuantity} x {formatPrice(item.price)}</strong>
              </div>
            ))}
          </div>
          <dl>
            <div><dt>Items</dt><dd>{totalItems}</dd></div>
            <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
            <div><dt>Estimated tax</dt><dd>{formatPrice(tax)}</dd></div>
            <div className="total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
        </aside>
      </section>
    </div>
  );
}
