import { ArrowDownAZ, Filter, Search } from 'lucide-react';

export default function ProductFilters({ filters, categories, onChange }) {
  const update = (name, value) => onChange({ ...filters, [name]: value });

  return (
    <section className="filters-bar" aria-label="Product filters">
      <label className="search-field">
        <Search size={18} />
        <input value={filters.keyword} onChange={(event) => update('keyword', event.target.value)} placeholder="Search name, brand, category" />
      </label>
      <label className="select-field">
        <Filter size={18} />
        <select value={filters.category} onChange={(event) => update('category', event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label className="select-field">
        <ArrowDownAZ size={18} />
        <select value={filters.sortBy} onChange={(event) => update('sortBy', event.target.value)}>
          <option value="featured">Featured</option>
          <option value="priceAsc">Price low to high</option>
          <option value="priceDesc">Price high to low</option>
          <option value="nameAsc">Name A to Z</option>
          <option value="newest">Newest first</option>
        </select>
      </label>
      <label className="toggle-field">
        <input type="checkbox" checked={filters.availableOnly} onChange={(event) => update('availableOnly', event.target.checked)} />
        Available only
      </label>
    </section>
  );
}