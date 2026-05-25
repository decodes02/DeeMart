import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page narrow-page">
      <section className="empty-state tall">
        <h1>Page not found</h1>
        <p>The route you opened does not exist in DeeMart.</p>
        <Link className="button primary" to="/">
          <Home size={18} /> Go home
        </Link>
      </section>
    </div>
  );
}