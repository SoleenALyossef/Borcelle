import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { AdminAPI_Config } from '../../../Config/AdminAPI-Config';
import { useAdminAuth } from '../../../context/AdminAuthContext';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { adminToken } = useAdminAuth();
  const isEdit = !!id;

  const [form, setForm] = useState({
    sku: '',
    price: '',
    category_id: '',
    image: '',
    en: { name: '', description: '' },
    ar: { name: '', description: '' },
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

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

    const url = isEdit
      ? `${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.PRODUCT}/${id}`
      : `${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.PRODUCT}`;

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

  return (
    <div>
      <div className="admin-header-row">
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
        </div>
      </Form>
    </div>
  );
};

export default ProductForm;