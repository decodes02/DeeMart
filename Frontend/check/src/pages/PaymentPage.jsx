import { ArrowLeft, BadgeCheck, CreditCard, LockKeyhole } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import { useCart } from '../hooks/useCart.js';
import { useToast } from '../hooks/useToast.js';
import { formatPrice } from '../utils/format.js';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { notify } = useToast();
  const total = location.state?.total ?? subtotal * 1.0825;

  const completePayment = () => {
    clearCart();
    notify('Payment completed. Order placed successfully.', 'success');
    navigate('/products');
  };

  if (items.length === 0) {
    return (
      <div className="page narrow-page">
        <EmptyState title="Payment session ended" message="Your cart is empty. Browse the catalog to place another demo order." />
      </div>
    );
  }

  return (
    <div className="page narrow-page">
      <Link className="text-link back-link" to="/checkout">
        <ArrowLeft size={18} /> Back to address
      </Link>

      <section className="payment-panel">
        <div className="payment-glow">
          <CreditCard size={34} />
        </div>
        <p className="eyebrow">Dummy payment</p>
        <h1>{formatPrice(total)}</h1>
        <p>This page simulates a payment confirmation step. No real card or gateway integration is used.</p>

        <div className="demo-card">
          <span>DeeMart Pay</span>
          <strong>4242 4242 4242 4242</strong>
          <small>DEMO CARD</small>
        </div>

        <div className="payment-assurance">
          <span><LockKeyhole size={17} /> Frontend-only test flow</span>
          <span><BadgeCheck size={17} /> Clears cart after confirmation</span>
        </div>

        <button className="button dark large full" type="button" onClick={completePayment}>
          Complete payment
        </button>
      </section>
    </div>
  );
}
