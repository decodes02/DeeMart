import { PackageSearch } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', message = 'Try adjusting the filters or add a new product.' }) {
  return (
    <section className="empty-state">
      <PackageSearch size={40} />
      <h2>{title}</h2>
      <p>{message}</p>
    </section>
  );
}