import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner, Button } from 'react-bootstrap';
import { MdPlayArrow } from 'react-icons/md';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import Navbarpayment from '../PaymentMethod/Navbarpayment';
import PageBanner from './PageBanner';
import './SharedPages.css';
import { API_Config } from '../../Config/API-Config';

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const ProfilePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);

  //التحقق من تسجيل الدخول
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/LoginPage');
      return;
    }

    // قراءة من localStorage فورًا
    const savedUser = {
      name: localStorage.getItem('userName') || '',
      email: localStorage.getItem('userEmail') || '',
      phone: localStorage.getItem('phone') || '',
      image: localStorage.getItem('userImage') || '',
    };
    setUser(savedUser);

   
    fetch(`${API_Config.BASE_URL}/customer`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const u = data?.data || data;
        if (!u) return;

        setUser((prev) => {
          const merged = {
            name: u.name || prev.name,
            email: u.email || prev.email,
            phone: u.phone || prev.phone,
            image: u.image || prev.image,
          };

          if (u.name) localStorage.setItem('userName', u.name);
          if (u.email) localStorage.setItem('userEmail', u.email);
          if (u.phone) localStorage.setItem('phone', u.phone);
          if (u.image) localStorage.setItem('userImage', u.image);

          return merged;
        });
      })
      .catch((err) => console.error('Fetch customer error:', err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('phone');
    localStorage.removeItem('userImage');
    navigate('/');
    window.location.reload();
  };

  const handleCardClick = (linkName) => {
    if (linkName === 'Terms and condition') navigate('/TermsPage');
    if (linkName === 'Contact us page') navigate('/ContactPage');
  };

  const settingsLinks = [
    'Wishlist page',
    'About us page',
    'Contact us page',
    'FAQ page',
    'Terms and condition',
    'Privacy Policy page',
  ];

  if (loading) {
    return (
      <>
        <Navbarpayment />
        <Container className="text-center py-5">
          <Spinner animation="border" variant="danger" />
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbarpayment />
      <Container>
        <div className="page-white-container">
          <PageBanner showBack={false} />

          {/* === Header === */}
          <div className="profile-header">
            <img
              src={user.image || DEFAULT_AVATAR}
              alt="Profile"
              className="avatar-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_AVATAR;
              }}
            />
            <div className="flex-grow-1">
              <h5 className="mb-1 fw-bold" style={{ color: 'var(--text-main)' }}>
                {user.name || 'Guest User'}
              </h5>
              <p className="mb-0" style={{ color: 'var(--text-muted)' }}>
                {user.email || 'No email'}
              </p>
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleLogout}
              className="d-flex align-items-center gap-2"
              style={{ borderColor: '#f13b63', color: '#f13b63' }}
            >
              <FiLogOut /> Logout
            </Button>
          </div>

          {/* === Inputs === */}
          <Row className="mb-4">
            <Col md={6} className="profile-input-group mb-3 mb-md-0">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={user.name}
                className="profile-input"
                readOnly
              />
            </Col>
            <Col md={6} className="profile-input-group">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={user.phone}
                className="profile-input"
                readOnly
              />
            </Col>
          </Row>

          <Form.Label
            className="mb-3 d-block"
            style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}
          >
            Settings
          </Form.Label>

          <Row>
            {settingsLinks.map((link, index) => (
              <Col md={4} key={index}>
                <div className="setting-card" onClick={() => handleCardClick(link)}>
                  <span>{link}</span>
                  <MdPlayArrow color="#ed355a" size={20} />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </>
  );
};

export default ProfilePage;