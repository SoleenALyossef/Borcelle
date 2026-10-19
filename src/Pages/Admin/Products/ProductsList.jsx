import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { AdminAPI_Config } from '../../../Config/AdminAPI-Config';
import { useAdminAuth } from '../../../context/AdminAuthContext';

const ProductsList = () => {
  const navigate = useNavigate();
  const { adminToken } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ دالة جلب المنتجات من الـ API
  const fetchProducts = () => {
    setLoading(true);
    setError('');

    fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.PRODUCT}?page=1`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        // التعامل مع شكل الاستجابة (قد تكون data.data أو data مباشرة)
        const items = data?.data?.data || data?.data || data || [];
        setProducts(Array.isArray(items) ? items : []);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Something went wrong');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (adminToken) {
      fetchProducts();
    }
  }, [adminToken]);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this product?')) return;

    fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.PRODUCT}/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete product');
        // إعادة جلب المنتجات بعد الحذف
        fetchProducts();
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div>
      <div className="admin-header-row">
        <h2 className="admin-page-title m-0">Products</h2>
        <div className="d-flex gap-2">
          <button 
            className="admin-btn-primary bg-light text-dark border" 
            onClick={fetchProducts}
            title="Refresh"
          >
            <FiRefreshCw /> Refresh
          </button>
          <button className="admin-btn-primary" onClick={() => navigate('/admin/products/new')}>
            <FiPlus /> Add Product
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="admin-card">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Loading products from API...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-5 text-muted">
            No products found. (API returned empty list)
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>SKU</th>
                  <th>Name (EN)</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img 
                        src={p.image || 'https://via.placeholder.com/50'} 
                        alt={p.name} 
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </td>
                    <td>{p.sku || p.id}</td>
                    <td>{p.name || p.en?.name || 'N/A'}</td>
                    <td>{parseFloat(p.price || 0).toFixed(2)}</td>
                    <td>{p.category_id || 'N/A'}</td>
                    <td className="admin-actions">
                      <button className="edit" onClick={() => navigate(`/admin/products/edit/${p.id}`)}>
                        <FiEdit2 size={12} />
                      </button>
                      <button className="delete" onClick={() => handleDelete(p.id)}>
                        <FiTrash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsList;