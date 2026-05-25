import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm.jsx';
import { useToast } from '../hooks/useToast.js';
import { getApiErrorMessage, productApi } from '../services/api.js';

export default function ProductEditorPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode !== 'edit') return;
    productApi
      .get(id)
      .then(setProduct)
      .catch((errorValue) => setError(getApiErrorMessage(errorValue, 'Unable to load product')))
      .finally(() => setLoading(false));
  }, [id, mode]);

  const submit = async (payload, image) => {
    setSaving(true);
    try {
      const savedProduct = mode === 'create' ? await productApi.create(payload, image) : await productApi.update(id, payload, image);
      notify(mode === 'create' ? 'Product created' : 'Product updated', 'success');
      navigate(`/products/${savedProduct.id}`);
    } catch (errorValue) {
      notify(getApiErrorMessage(errorValue, 'Unable to save product'), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page narrow-page">
      <Link className="text-link back-link" to={mode === 'edit' ? `/products/${id}` : '/products'}>
        <ArrowLeft size={18} /> Back
      </Link>
      <section className="page-header">
        <p className="eyebrow">{mode === 'create' ? 'New catalog item' : 'Catalog maintenance'}</p>
        <h1>{mode === 'create' ? 'Add product' : 'Edit product'}</h1>
        <p>Product metadata and images are submitted as multipart form data to the Spring Boot API.</p>
      </section>
      {loading && <div className="detail-skeleton" />}
      {error && <div className="alert error">{error}</div>}
      {!loading && !error && <ProductForm mode={mode} initialProduct={product} onSubmit={submit} isSaving={saving} />}
    </div>
  );
}
