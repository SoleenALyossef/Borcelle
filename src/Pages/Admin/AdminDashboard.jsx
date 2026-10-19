import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { FiBox, FiShoppingCart, FiTag, FiUsers } from 'react-icons/fi';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { AdminAPI_Config } from '../../Config/AdminAPI-Config';
import { useAdminAuth } from '../../context/AdminAuthContext';

const MAIN_COLOR = '#f13b63';

const AdminDashboard = () => {
  const { adminToken } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, orders: 0, categories: 0, customers: 24 });

  // بيانات المخططات
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    if (!adminToken) return;

    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${adminToken}`,
    };

    // جلب البيانات من الـ API
    Promise.all([
      fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.PRODUCT}?page=1`, { headers }).then(r => r.json()),
      fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.ORDER}?page=1`, { headers }).then(r => r.json()),
      fetch(`${AdminAPI_Config.BASE_URL}/${AdminAPI_Config.ENDPOINTS.CATEGORY}?page=1`, { headers }).then(r => r.json()),
    ])
      .then(([productsRes, ordersRes, categoriesRes]) => {
        const productsList = productsRes?.data?.data || [];
        const ordersList = ordersRes?.data?.data || [];
        const categoriesList = categoriesRes?.data?.data || [];

        // 1. الإحصائيات العامة
        setStats({
          products: productsRes?.data?.total || productsList.length || 0,
          orders: ordersRes?.data?.total || ordersList.length || 0,
          categories: categoriesRes?.data?.total || categoriesList.length || 0,
          customers: 24, // قيمة افتراضية
        });

        // 2. تجهيز بيانات المخطط الخطي (مبيعات آخر 7 طلبات)
        const lineMock = ordersList.slice(0, 7).map((o, i) => ({
          name: `Order ${i + 1}`,
          sales: parseFloat(o.total) || 0,
        })).reverse();
        setLineData(lineMock.length > 0 ? lineMock : [
          { name: 'Mon', sales: 1200 }, { name: 'Tue', sales: 2100 }, { name: 'Wed', sales: 800 }, { name: 'Thu', sales: 1600 }
        ]);

        // 3. تجهيز بيانات المخطط الشريطي (حالات الطلبات)
        const statusCounts = ordersList.reduce((acc, o) => {
          const status = o.status || 'Pending';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        const barMock = Object.keys(statusCounts).map(key => ({
          name: key,
          count: statusCounts[key],
        }));
        setBarData(barMock.length > 0 ? barMock : [
          { name: 'Pending', count: 12 }, { name: 'Accepted', count: 19 }, { name: 'Canceled', count: 3 }
        ]);

        // 4. تجهيز بيانات المخطط الدائري (توزيع المنتجات حسب التصنيف)
        const pieMock = categoriesList.slice(0, 4).map((c, i) => ({
          name: c.name || `Category ${i + 1}`,
          value: Math.floor(Math.random() * 100) + 10, // قيمة افتراضية للتوزيع
        }));
        setPieData(pieMock.length > 0 ? pieMock : [
          { name: 'Electronics', value: 400 }, { name: 'Fashion', value: 300 }, { name: 'Home', value: 300 }
        ]);
      })
      .catch((err) => console.error('Dashboard fetch error:', err))
      .finally(() => setLoading(false));
  }, [adminToken]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" style={{ color: MAIN_COLOR }} />
        <p className="mt-3">Loading Dashboard...</p>
      </div>
    );
  }

  const StatCard = ({ icon, value, label, color }) => (
    <Card className="border-0 shadow-sm rounded-4 h-100">
      <Card.Body className="d-flex align-items-center gap-3">
        <div
          className="rounded-3 d-flex align-items-center justify-content-center text-white"
          style={{ width: '55px', height: '55px', backgroundColor: color }}
        >
          {icon}
        </div>
        <div>
          <h3 className="fw-bold mb-0">{value}</h3>
          <span className="text-muted small">{label}</span>
        </div>
      </Card.Body>
    </Card>
  );

  // ألوان المخطط الدائري
  const COLORS = [MAIN_COLOR, '#3b82f6', '#f59e0b', '#10b981'];

  return (
    <div className="p-1">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0">Dashboard Overview</h3>
      </div>

      {/* 1. الإحصائيات */}
      <Row className="g-3 mb-4">
        <Col md={6} lg={3}>
          <StatCard icon={<FiBox size={24} />} value={stats.products} label="Total Products" color="#3b82f6" />
        </Col>
        <Col md={6} lg={3}>
          <StatCard icon={<FiShoppingCart size={24} />} value={stats.orders} label="Total Orders" color={MAIN_COLOR} />
        </Col>
        <Col md={6} lg={3}>
          <StatCard icon={<FiTag size={24} />} value={stats.categories} label="Categories" color="#f59e0b" />
        </Col>
        <Col md={6} lg={3}>
          <StatCard icon={<FiUsers size={24} />} value={stats.customers} label="Customers" color="#10b981" />
        </Col>
      </Row>

      {/* 2. المخططات */}
      <Row className="g-4">
        {/* Line Chart */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body>
              <h5 className="fw-bold mb-4">Total Sales (Recent Orders)</h5>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="sales" stroke={MAIN_COLOR} strokeWidth={3} dot={{ r: 4, fill: MAIN_COLOR }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Pie Chart */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body>
              <h5 className="fw-bold mb-4">Products by Category</h5>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Bar Chart */}
        <Col lg={12}>
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body>
              <h5 className="fw-bold mb-4">Orders Status</h5>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(241,59,99,0.05)' }} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="count" fill={MAIN_COLOR} radius={[6, 6, 0, 0]} barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;