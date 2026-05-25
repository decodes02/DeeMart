import { ImagePlus, Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatDate } from '../utils/format.js';

const emptyProduct = {
  name: '',
  brand: '',
  description: '',
  price: '',
  category: '',
  releaseDate: new Date().toISOString().slice(0, 10),
  available: true,
  quantity: 1,
};

export default function ProductForm({ initialProduct, mode, onSubmit, isSaving }) {
  const [product, setProduct] = useState(() => ({ ...emptyProduct, ...initialProduct }));
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const previewLabel = useMemo(() => {
    if (image) {
      return image.name;
    }
    if (initialProduct?.imageName) {
      return `Current image: ${initialProduct.imageName}`;
    }
    return 'Upload a product image';
  }, [image, initialProduct]);

  const update = (name, value) => setProduct((current) => ({ ...current, [name]: value }));

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    setImage(file ?? null);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(
      {
        ...product,
        price: Number(product.price),
        quantity: Number(product.quantity),
      },
      image,
    );
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Product name
          <input required maxLength="120" value={product.name} onChange={(event) => update('name', event.target.value)} />
        </label>
        <label>
          Brand
          <input required maxLength="80" value={product.brand} onChange={(event) => update('brand', event.target.value)} />
        </label>
        <label>
          Price
          <input required min="0.01" step="0.01" type="number" value={product.price} onChange={(event) => update('price', event.target.value)} />
        </label>
        <label>
          Category
          <input required maxLength="80" value={product.category} onChange={(event) => update('category', event.target.value)} />
        </label>
        <label>
          Release date
          <input required type="date" value={product.releaseDate} onChange={(event) => update('releaseDate', event.target.value)} />
        </label>
        <label>
          Quantity
          <input required min="0" type="number" value={product.quantity} onChange={(event) => update('quantity', event.target.value)} />
        </label>
      </div>

      <label>
        Description
        <textarea required rows="5" maxLength="2000" value={product.description} onChange={(event) => update('description', event.target.value)} />
      </label>

      <div className="form-row split">
        <label className="toggle-field strong">
          <input type="checkbox" checked={product.available} onChange={(event) => update('available', event.target.checked)} />
          Mark as available
        </label>
        <span className="muted">Release: {formatDate(product.releaseDate)}</span>
      </div>

      <label className="upload-zone">
        <ImagePlus size={24} />
        <span>{previewLabel}</span>
        <input type="file" accept="image/*" onChange={handleImage} />
      </label>
      {preview && <img className="image-preview" src={preview} alt="Product preview" />}

      <div className="form-actions">
        <button className="button primary large" disabled={isSaving} type="submit">
          <Save size={18} /> {isSaving ? 'Saving...' : mode === 'create' ? 'Create product' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}