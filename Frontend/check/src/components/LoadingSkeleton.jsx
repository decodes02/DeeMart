export default function LoadingSkeleton({ count = 8 }) {
  return (
    <div className="product-grid" aria-label="Loading products">
      {Array.from({ length: count }).map((_, index) => (
        <article className="product-card skeleton-card" key={index}>
          <div className="skeleton image" />
          <div className="skeleton line wide" />
          <div className="skeleton line" />
          <div className="skeleton line short" />
        </article>
      ))}
    </div>
  );
}