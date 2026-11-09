<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import { useState, useEffect, useCallback } from 'react';
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
import { useNavigate, useParams } from 'react-router';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { AdminAPI_Config } from '../../../Config/AdminAPI-Config';
import { useAdminAuth } from '../../../context/AdminAuthContext';
<<<<<<< HEAD
=======
import { useTranslation } from 'react-i18next';
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { adminToken } = useAdminAuth();
<<<<<<< HEAD
=======
  const { i18n } = useTranslation();
  const label = (en, ar) => i18n.language === 'ar' ? ar : en;
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
  const isEdit = !!id;

  const [form, setForm] = useState({
    en: { name: '' },
    ar: { name: '' },
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

<<<<<<< HEAD
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${adminToken}`,
  });
=======
  const getHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${adminToken}`,
  }), [adminToken]);
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538

  // جلب بيانات التصنيف في حال التعديل
  useEffect(() => {
    if (isEdit && adminToken) {
<<<<<<< HEAD
=======
      // eslint-disable-next-line react-hooks/set-state-in-effect
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
      setFetching(true);
      fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.CATEGORY}/${id}`, {
        headers: getHeaders(),
      })
        .then((res) => res.json())
        .then((data) => {
          const c = data?.data || data;
          if (c) {
            setForm({
              en: { name: c.en?.name || c.name || '' },
              ar: { name: c.ar?.name || '' },
            });
          }
        })
        .catch((err) => console.error('Fetch category error:', err))
        .finally(() => setFetching(false));
    } else {
      setFetching(false);
    }
<<<<<<< HEAD
  }, [id, isEdit, adminToken]);
=======
  }, [id, isEdit, adminToken, getHeaders]);
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const url = isEdit
      ? `${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.CATEGORY}/${id}`
      : `${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.CATEGORY}`;
    const method = isEdit ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(form),
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
<<<<<<< HEAD
        alert(isEdit ? 'Category updated ' : 'Category created ');
        navigate('/admin/categories');
        window.location.reload(); // هذا السطر سيجبر الصفحة على إعادة التحميل وجلب البيانات الجديدة
        })
=======
        window.dispatchEvent(new CustomEvent('admin:data-changed', { detail: { type: 'category', action: isEdit ? 'update' : 'create' } }));
        navigate('/admin/categories');
      })
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
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
<<<<<<< HEAD
        <p className="mt-2">Loading...</p>
=======
        <p className="mt-2">{label('Loading...', 'جارٍ التحميل...')}</p>
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
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
<<<<<<< HEAD
          <FiArrowLeft /> Back
        </button>
        <h2 className="admin-page-title m-0">{isEdit ? 'Edit Category' : 'New Category'}</h2>
=======
          <FiArrowLeft /> {label('Back', 'رجوع')}
        </button>
        <h2 className="admin-page-title m-0">{isEdit ? label('Edit Category', 'تعديل التصنيف') : label('New Category', 'إضافة تصنيف')}</h2>
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
      </div>

      <Form className="admin-card" onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        <Row className="g-3">
          <Col md={6}>
<<<<<<< HEAD
            <h6 className="mt-2 fw-bold">English</h6>
            <Form.Label>Name (EN)</Form.Label>
=======
            <h6 className="mt-2 fw-bold">{label('English', 'الإنجليزية')}</h6>
            <Form.Label>{label('Name (EN)', 'الاسم بالإنجليزية')}</Form.Label>
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
            <Form.Control
              value={form.en.name}
              onChange={(e) => setForm({ ...form, en: { name: e.target.value } })}
              required
            />
          </Col>
          <Col md={6}>
            <h6 className="mt-2 fw-bold">العربية</h6>
<<<<<<< HEAD
            <Form.Label>الاسم (AR)</Form.Label>
=======
            <Form.Label>{label('Name (AR)', 'الاسم بالعربية')}</Form.Label>
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
            <Form.Control
              value={form.ar.name}
              onChange={(e) => setForm({ ...form, ar: { name: e.target.value } })}
              dir="rtl"
              required
            />
          </Col>
        </Row>

        <div className="mt-4">
          <button type="submit" className="admin-btn-primary" disabled={loading}>
            {loading ? (
<<<<<<< HEAD
              <><Spinner as="span" animation="border" size="sm" className="me-2" />Saving...</>
            ) : (
              <><FiSave /> {isEdit ? 'Update' : 'Save'}</>
=======
              <><Spinner as="span" animation="border" size="sm" className="me-2" />{label('Saving...', 'جارٍ الحفظ...')}</>
            ) : (
              <><FiSave /> {isEdit ? label('Update', 'تحديث') : label('Save', 'حفظ')}</>
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
            )}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default CategoryForm;