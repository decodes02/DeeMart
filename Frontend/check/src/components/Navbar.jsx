import { Menu, PackagePlus, Search, ShoppingBag, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';

export default function Navbar() {
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const submitSearch = (event) => {
    event.preventDefault();
    navigate(keyword.trim() ? `/products?q=${encodeURIComponent(keyword.trim())}` : '/products');
    setIsOpen(false);
  };

  return (
    <header className="navbar">
      <NavLink to="/" className="brand" onClick={() => setIsOpen(false)}>
        <span className="brand-mark">D</span>
        <span>DeeMart</span>
      </NavLink>

      <button className="icon-button mobile-menu" type="button" aria-label="Toggle navigation" onClick={() => setIsOpen((value) => !value)}>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <nav className={`nav-links ${isOpen ? 'open' : ''}`}>
        <NavLink to="/products" onClick={() => setIsOpen(false)}>
          <ShoppingBag size={18} /> Products
        </NavLink>
        <NavLink to="/products/new" onClick={() => setIsOpen(false)}>
          <PackagePlus size={18} /> Add Product
        </NavLink>
        <NavLink to="/cart" className="cart-link" onClick={() => setIsOpen(false)}>
          <ShoppingCart size={18} /> Cart <span>{totalItems}</span>
        </NavLink>
      </nav>

      <form className="nav-search" onSubmit={submitSearch}>
        <Search size={18} />
        <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Search products" aria-label="Search products" />
      </form>
    </header>
  );
}
