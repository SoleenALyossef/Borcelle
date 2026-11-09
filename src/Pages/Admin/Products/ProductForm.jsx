<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { AdminAPI_Config } from '../../../Config/AdminAPI-Config';
import { useAdminAuth } from '../../../context/AdminAuthContext';
=======
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Form, Row, Col, Spinner, Image } from 'react-bootstrap';
import { FiSave, FiArrowLeft, FiImage, FiX } from 'react-icons/fi';
import { AdminAPI_Config } from '../../../Config/AdminAPI-Config';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { useTranslation } from 'react-i18next';

const API_ROOT = AdminAPI_Config.BASE_URL.replace(/\/api\/?$/, '');
const resolveImage = (value) => {
  if (!value) return '';
  const path = typeof value === 'object' ? (value.url || value.path || value.image) : value;
  if (!path || typeof path !== 'string') return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  const clean = path.replace(/^\/+/, '');
  return clean.startsWith('storage/') ? `${API_ROOT}/${clean}` : `${API_ROOT}/storage/${clean}`;
};
const responseItems = (data) => {
  const root = data?.data ?? data;
  if (Array.isArray(root)) return root;
  if (Array.isArray(root?.data)) return root.data;
  return [];
};
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { adminToken } = useAdminAuth();
<<<<<<< HEAD
  const isEdit = !!id;

  const [form, setForm] = useState({
    sku: '',
    price: '',
    category_id: '',
    image: '',
    en: { name: '', description: '' },
    ar: { name: '', description: '' },
  });
=======
  const { i18n } = useTranslation();
  const isEdit = !!id;
  const [form, setForm] = useState({
    sku: '', price: '', category_id: '', image: '',
    en: { name: '', description: '' },
    ar: { name: '', description: '' },
  });
  const [primaryImageFile, setPrimaryImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

<<<<<<< HEAD
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${adminToken}`,
  });

  // ✅ جلب التصنيفات الحقيقية من الـ API
  useEffect(() => {
    if (!adminToken) return;

    fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.CATEGORY}`, {
      headers: getHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        const items = data?.data?.data || data?.data || data || [];
        setCategories(Array.isArray(items) ? items : []);
      })
      .catch((err) => console.error('Fetch categories error:', err));
  }, [adminToken]);

  // ✅ جلب بيانات المنتج في حال التعديل
  useEffect(() => {
    if (isEdit && adminToken) {
      setFetching(true);
      fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.PRODUCT}/${id}`, {
        headers: getHeaders(),
      })
        .then((res) => res.json())
        .then((data) => {
          const p = data?.data || data;
          if (p) {
            setForm({
              sku: p.sku || '',
              price: p.price || '',
              category_id: p.category_id || '',
              image: p.image || '',
              en: {
                name: p.en?.name || p.name || '',
                description: p.en?.description || p.description || '',
              },
              ar: {
                name: p.ar?.name || '',
                description: p.ar?.description || '',
              },
            });
          }
        })
        .catch((err) => console.error('Fetch product error:', err))
        .finally(() => setFetching(false));
    } else {
      setFetching(false);
    }
  }, [id, isEdit, adminToken]);

  const handleChange = (field, value) => setForm({ ...form, [field]: value });
  const handleLangChange = (lang, field, value) =>
    setForm({ ...form, [lang]: { ...form[lang], [field]: value } });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
=======
  const authHeaders = () => ({ Accept: 'application/json', Authorization: `Bearer ${adminToken}` });
  const label = (en, ar) => i18n.language === 'ar' ? ar : en;
  const primaryImagePreview = useMemo(() => primaryImageFile ? URL.createObjectURL(primaryImageFile) : resolveImage(form.image), [primaryImageFile, form.image]);
  useEffect(() => () => { if (primaryImagePreview.startsWith('blob:')) URL.revokeObjectURL(primaryImagePreview); }, [primaryImagePreview]);

  useEffect(() => {
    if (!adminToken) return;
    fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.CATEGORY}`, { headers: authHeaders() })
      .then((res) => { if (!res.ok) throw new Error('Failed to load categories'); return res.json(); })
      .then((data) => setCategories(responseItems(data)))
      .catch((err) => console.error('Fetch categories error:', err));
  // authHeaders uses the current token; loading categories should run when token changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminToken]);

  useEffect(() => {
    if (!isEdit || !adminToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFetching(false);
      return;
    }
    let cancelled = false;
    setFetching(true);
    fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.PRODUCT}/${id}`, { headers: authHeaders() })
      .then((res) => { if (!res.ok) throw new Error('Failed to load product'); return res.json(); })
      .then((data) => {
        if (cancelled) return;
        const p = data?.data ?? data;
        const primary = p?.image ?? p?.avatar ?? '';
        setForm({
          sku: p?.sku || '',
          price: p?.price ?? '',
          category_id: p?.category_id ?? p?.category?.id ?? '',
          image: typeof primary === 'string' ? primary : (primary?.url || primary?.path || ''),
          en: { name: p?.en?.name || p?.name || '', description: p?.en?.description || p?.description || '' },
          ar: { name: p?.ar?.name || '', description: p?.ar?.description || '' },
        });
        const gallery = Array.isArray(p?.images) ? p.images : (Array.isArray(primary) ? primary.slice(1) : []);
        setExistingImages(gallery);
      })
      .catch((err) => { if (!cancelled) setError(err.message || 'Failed to load product'); })
      .finally(() => { if (!cancelled) setFetching(false); });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit, adminToken]);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const handleLangChange = (lang, field, value) => setForm((prev) => ({ ...prev, [lang]: { ...prev[lang], [field]: value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!isEdit && !primaryImageFile) {
      setError(label('Please choose a main product image.', 'يرجى اختيار الصورة الأساسية للمنتج.'));
      setLoading(false);
      return;
    }
    if (priceIsInvalid(form.price)) {
      setError(label('Enter a valid price greater than or equal to zero.', 'أدخلي سعراً صحيحاً أكبر من أو يساوي الصفر.'));
      setLoading(false);
      return;
    }
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538

    const url = isEdit
      ? `${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.PRODUCT}/${id}`
      : `${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.PRODUCT}`;
<<<<<<< HEAD

    const method = isEdit ? 'PUT' : 'POST';

    const payload = {
      sku: form.sku,
      price: Number(form.price),
      category_id: Number(form.category_id),
      image: form.image,
      en: form.en,
      ar: form.ar,
    };

    fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message || 'Something went wrong');
          });
        }
        return res.json();
      })
      .then(() => {
        alert(isEdit ? 'Product updated ✅' : 'Product created ✅');
        navigate('/admin/products');
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  if (fetching) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" style={{ color: '#f13b63' }} />
        <p className="mt-2">Loading...</p>
      </div>
    );
  }
=======
    const payload = new FormData();
    if (isEdit) payload.append('_method', 'PUT');
    payload.append('sku', form.sku);
    payload.append('price', String(Number(form.price)));
    payload.append('category_id', String(form.category_id));
    payload.append('en[name]', form.en.name);
    payload.append('en[description]', form.en.description || '');
    payload.append('ar[name]', form.ar.name || '');
    payload.append('ar[description]', form.ar.description || '');
    if (primaryImageFile) payload.append('image', primaryImageFile);
    additionalImageFiles.forEach((file) => payload.append('images[]', file));

    try {
      const res = await fetch(url, {
        method: isEdit ? 'POST' : 'POST',
        headers: authHeaders(),
        body: payload,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const validationErrors = data?.errors ? Object.values(data.errors).flat().join(' ') : '';
        throw new Error(validationErrors || data?.message || label('Could not save product.', 'تعذر حفظ المنتج.'));
      }
      window.dispatchEvent(new CustomEvent('admin:data-changed', { detail: { type: 'product', action: isEdit ? 'update' : 'create' } }));
      navigate('/admin/products');
    } catch (err) {
      setError(err.message || label('Something went wrong.', 'حدث خطأ غير متوقع.'));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-5"><Spinner animation="border" style={{ color: '#f13b63' }} /><p className="mt-2">{label('Loading...', 'جارٍ التحميل...')}</p></div>;
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538

  return (
    <div>
      <div className="admin-header-row">
<<<<<<< HEAD
        <button
          className="admin-btn-primary"
          style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-main)' }}
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft /> Back
        </button>
        <h2 className="admin-page-title m-0">{isEdit ? 'Edit Product' : 'New Product'}</h2>
      </div>

      <Form className="admin-card" onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <Row className="g-3">
          <Col md={6}>
            <Form.Label>SKU</Form.Label>
            <Form.Control
              value={form.sku}
              onChange={(e) => handleChange('sku', e.target.value)}
              required
            />
          </Col>
          <Col md={6}>
            <Form.Label>Price (AED)</Form.Label>
            <Form.Control
              type="number"
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
              required
            />
          </Col>
          <Col md={6}>
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={form.category_id}
              onChange={(e) => handleChange('category_id', e.target.value)}
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || c.en?.name || `Category #${c.id}`}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              value={form.image}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </Col>

          <Col md={6}>
            <h6 className="mt-2 fw-bold">English</h6>
            <Form.Label>Name (EN)</Form.Label>
            <Form.Control
              value={form.en.name}
              onChange={(e) => handleLangChange('en', 'name', e.target.value)}
              required
            />
            <Form.Label className="mt-2">Description (EN)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={form.en.description}
              onChange={(e) => handleLangChange('en', 'description', e.target.value)}
            />
          </Col>

          <Col md={6}>
            <h6 className="mt-2 fw-bold">العربية</h6>
            <Form.Label>الاسم</Form.Label>
            <Form.Control
              value={form.ar.name}
              onChange={(e) => handleLangChange('ar', 'name', e.target.value)}
              dir="rtl"
            />
            <Form.Label className="mt-2">الوصف</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={form.ar.description}
              onChange={(e) => handleLangChange('ar', 'description', e.target.value)}
              dir="rtl"
            />
          </Col>
        </Row>

        <div className="mt-4">
          <button type="submit" className="admin-btn-primary" disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <FiSave /> {isEdit ? 'Update' : 'Save'}
              </>
            )}
          </button>
=======
        <button type="button" className="admin-btn-primary" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-main)' }} onClick={() => navigate(-1)}>
          <FiArrowLeft /> {label('Back', 'رجوع')}
        </button>
        <h2 className="admin-page-title m-0">{isEdit ? label('Edit Product', 'تعديل المنتج') : label('New Product', 'إضافة منتج')}</h2>
      </div>

      <Form className="admin-card" onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <Row className="g-3">
          <Col md={6}>
            <Form.Label>{label('SKU', 'رمز المنتج')}</Form.Label>
            <Form.Control value={form.sku} onChange={(e) => handleChange('sku', e.target.value)} required />
          </Col>
          <Col md={6}>
            <Form.Label>{label('Price (AED)', 'السعر (درهم)')}</Form.Label>
            <Form.Control type="number" min="0" step="0.01" value={form.price} onChange={(e) => handleChange('price', e.target.value)} required />
          </Col>
          <Col md={12}>
            <Form.Label>{label('Category', 'التصنيف')}</Form.Label>
            <Form.Select value={form.category_id} onChange={(e) => handleChange('category_id', e.target.value)} required>
              <option value="">{label('Select category', 'اختاري التصنيف')}</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{(i18n.language === 'ar' ? (c.ar?.name || c.name || c.en?.name) : (c.en?.name || c.name || c.ar?.name)) || `#${c.id}`}</option>)}
            </Form.Select>
          </Col>

          <Col md={6}>
            <Form.Label className="d-flex align-items-center gap-2"><FiImage /> {label('Main product image', 'الصورة الأساسية للمنتج')}</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={(e) => setPrimaryImageFile(e.target.files?.[0] || null)} required={!isEdit && !primaryImageFile} />
            <Form.Text>{label('Choose one main image. JPG, PNG or WEBP recommended.', 'اختاري صورة أساسية واحدة. يفضّل استخدام JPG أو PNG أو WEBP.')}</Form.Text>
            {primaryImagePreview && <div className="mt-3"><Image rounded src={primaryImagePreview} alt="Main product preview" style={{ width: 130, height: 130, objectFit: 'cover' }} /></div>}
          </Col>
          <Col md={6}>
            <Form.Label className="d-flex align-items-center gap-2"><FiImage /> {label('Additional product images', 'صور إضافية للمنتج')}</Form.Label>
            <Form.Control type="file" accept="image/*" multiple onChange={(e) => setAdditionalImageFiles(Array.from(e.target.files || []))} />
            <Form.Text>{label('Select several images for the same product.', 'يمكنك اختيار عدة صور للمنتج نفسه.')}</Form.Text>
            {existingImages.length > 0 && <div className="d-flex flex-wrap gap-2 mt-3">{existingImages.map((img, index) => <Image key={`${resolveImage(img)}-${index}`} rounded src={resolveImage(img)} alt={`Product gallery ${index + 1}`} style={{ width: 72, height: 72, objectFit: 'cover' }} />)}</div>}
            {additionalImageFiles.length > 0 && <div className="small text-muted mt-2">{label('Selected files:', 'الملفات المختارة:')} {additionalImageFiles.map((file) => file.name).join('، ')}</div>}
          </Col>

          <Col md={6}>
            <h6 className="mt-2 fw-bold">{label('English details', 'تفاصيل المنتج بالإنجليزية')}</h6>
            <Form.Label>{label('Name (EN)', 'الاسم بالإنجليزية')}</Form.Label>
            <Form.Control value={form.en.name} onChange={(e) => handleLangChange('en', 'name', e.target.value)} required />
            <Form.Label className="mt-2">{label('Description (EN)', 'الوصف بالإنجليزية')}</Form.Label>
            <Form.Control as="textarea" rows={3} value={form.en.description} onChange={(e) => handleLangChange('en', 'description', e.target.value)} />
          </Col>
          <Col md={6}>
            <h6 className="mt-2 fw-bold">{label('Arabic details', 'تفاصيل المنتج بالعربية')}</h6>
            <Form.Label>{label('Name (AR)', 'الاسم بالعربية')}</Form.Label>
            <Form.Control value={form.ar.name} onChange={(e) => handleLangChange('ar', 'name', e.target.value)} dir="rtl" />
            <Form.Label className="mt-2">{label('Description (AR)', 'الوصف بالعربية')}</Form.Label>
            <Form.Control as="textarea" rows={3} value={form.ar.description} onChange={(e) => handleLangChange('ar', 'description', e.target.value)} dir="rtl" />
          </Col>
        </Row>
        <div className="mt-4 d-flex flex-wrap gap-2">
          <button type="submit" className="admin-btn-primary" disabled={loading}>
            {loading ? <><Spinner as="span" animation="border" size="sm" className="me-2" />{label('Saving...', 'جارٍ الحفظ...')}</> : <><FiSave /> {isEdit ? label('Update Product', 'تحديث المنتج') : label('Save Product', 'حفظ المنتج')}</>}
          </button>
          {primaryImageFile && <button type="button" className="admin-btn-primary bg-light text-dark border" onClick={() => setPrimaryImageFile(null)}><FiX /> {label('Clear selected main image', 'إزالة الصورة المختارة')}</button>}
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
        </div>
      </Form>
    </div>
  );
};

<<<<<<< HEAD
export default ProductForm;
=======
function priceIsInvalid(value) {
  return value === '' || !Number.isFinite(Number(value)) || Number(value) < 0;
}

export default ProductForm;
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
