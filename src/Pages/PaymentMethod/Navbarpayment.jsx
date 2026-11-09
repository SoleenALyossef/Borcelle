import { Navbar, Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import { BsBag, BsHeart, BsPerson, BsChatDots, BsBoxSeam, BsThreeDotsVertical } from 'react-icons/bs';
import { FiMoon, FiSun, FiGlobe, FiUser, FiLogOut, FiShield } from 'react-icons/fi';
<<<<<<< HEAD
import logoimg from '../../assets/image/Black and Red Online Store Logo 1.png';
import './Checkout.css';
import { NavLink, useNavigate } from 'react-router';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
=======
import { useEffect, useState } from 'react';
import logoimg from '../../assets/image/Black and Red Online Store Logo 1.png';
import './Checkout.css';
import { NavLink, useNavigate, useLocation } from 'react-router';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { API_Config } from '../../Config/API-Config';

const getCollection = (payload) => {
  const candidates = [payload?.data?.data, payload?.data?.categories, payload?.data, payload?.categories, payload?.results, payload?.items, payload];
  return candidates.find(Array.isArray) || [];
};

const categoryName = (category, language) => language === 'ar'
  ? (category?.ar?.name || category?.name || category?.en?.name || `#${category?.id ?? ''}`)
  : (category?.en?.name || category?.name || category?.ar?.name || `#${category?.id ?? ''}`);
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538

const Navbarpayment = () => {
  const { cartCount, favoriteCount, ordersCount } = useCart();
  const { theme, toggleTheme } = useTheme();
<<<<<<< HEAD
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // مراقبة حالة تسجيل الدخول
  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
=======
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(() => new URLSearchParams(location.search).get('category_id') || '');
  const [searchTerm, setSearchTerm] = useState(() => new URLSearchParams(location.search).get('search') || '');

  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', checkAuth);
    window.addEventListener('customer-auth-changed', checkAuth);
    window.addEventListener('focus', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('customer-auth-changed', checkAuth);
      window.removeEventListener('focus', checkAuth);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    // Keep the navbar's category selector aligned with category navigation and search URLs.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedCategory(params.get('category_id') || '');
    if (params.has('search')) setSearchTerm(params.get('search') || '');
  }, [location.search]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_Config.BASE_URL}/${API_Config.ENDPOINTS.CATEGORY}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load categories');
        return response.json();
      })
      .then((payload) => setCategories(getCollection(payload)))
      .catch((error) => {
        if (error.name !== 'AbortError') console.error('Search categories error:', error);
      });
    return () => controller.abort();
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
<<<<<<< HEAD
=======
    localStorage.removeItem('redirectAfterLogin');
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
    localStorage.removeItem('phone');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userImage');
    setIsLoggedIn(false);
<<<<<<< HEAD
=======
    window.dispatchEvent(new Event('customer-auth-changed'));
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
    navigate('/');
    window.location.reload();
  };

<<<<<<< HEAD
=======
  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (selectedCategory) params.set('category_id', selectedCategory);
    navigate(`/ProductListing${params.toString() ? `?${params.toString()}` : ''}`);
  };

>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
  const badgeStyle = {
    backgroundColor: '#ff3b69',
    color: '#fff',
    fontSize: '0.72rem',
    fontWeight: '700',
    minWidth: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: '-12px',
    right: '-4px',
    border: '1px solid #fff',
    lineHeight: 1,
<<<<<<< HEAD
    padding: '3 6px'
=======
    padding: '3px 6px',
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
  };

  return (
    <Navbar expand="lg" className="main-header d-flex justify-content-between align-items-center">
<<<<<<< HEAD
      <NavLink href="#home" className="d-flex align-items-center gap-2" to="/">
        <img src={logoimg} alt="Logo" />
      </NavLink>

      <InputGroup className="search-box-group">
        <Form.Control placeholder="Search" className="search-input" />
        <Form.Select className="category-select">
          <option>All category</option>
          <option>Electronics</option>
          <option>Watches</option>
        </Form.Select>
        <Button className="btn-search">Search</Button>
      </InputGroup>
=======
      <NavLink className="d-flex align-items-center gap-2" to="/" aria-label="Borcelle home">
        <img src={logoimg} alt="Borcelle" />
      </NavLink>

      <Form onSubmit={handleSearch} className="search-box-group">
        <InputGroup>
          <Form.Control
            placeholder={t('navbar.searchPlaceholder')}
            className="search-input"
            aria-label={t('navbar.searchPlaceholder')}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <Form.Select
            className="category-select"
            aria-label={t('navbar.allCategoryOption')}
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="">{t('navbar.allCategoryOption')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {categoryName(category, i18n.language)}
              </option>
            ))}
          </Form.Select>
          <Button type="submit" className="btn-search">{t('navbar.search')}</Button>
        </InputGroup>
      </Form>
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538

      <div className="d-flex align-items-center">
        <NavLink className="nav-icon-item" to="/ProfilePage">
          <BsPerson size={20} />
<<<<<<< HEAD
          <span>Profile</span>
        </NavLink>
        <NavLink className="nav-icon-item" to="/ContactPage">
          <BsChatDots size={20} />
          <span>Message</span>
        </NavLink>

        <NavLink className="nav-icon-item position-relative" to="/favorites">
          <BsHeart size={20} />
          <span>Favorites</span>
          {favoriteCount > 0 && (
            <span className="position-absolute badge rounded-circle" style={badgeStyle}>{favoriteCount}</span>
          )}
        </NavLink>

        <NavLink className="nav-icon-item position-relative" to="/orders">
          <BsBoxSeam size={20} />
          <span>Orders</span>
          {ordersCount > 0 && (
            <span className="position-absolute badge rounded-circle" style={badgeStyle}>{ordersCount}</span>
          )}
        </NavLink>

        <NavLink className="nav-icon-item position-relative" to="/Mycart">
          <BsBag size={20} />
          <span>My cart</span>
          {cartCount > 0 && (
            <span className="position-absolute badge rounded-circle" style={badgeStyle}>{cartCount}</span>
          )}
        </NavLink>

     
        <Dropdown 
          align={i18n.language === 'ar' ? 'start' : 'end'} 
          className={i18n.language === 'ar' ? 'ms-3' : 'ms-3'}
          >
          <Dropdown.Toggle
            as="div"
            id="main-menu-dropdown"
            className="nav-icon-item"
           
          >
            <BsThreeDotsVertical size={20} />
            
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ minWidth: '220px' }} className="shadow">
            <Dropdown.Item onClick={toggleTheme} className="d-flex align-items-center gap-2">
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Dropdown.Item>

=======
          <span>{t('navbar.profile')}</span>
        </NavLink>
        <NavLink className="nav-icon-item" to="/ContactPage">
          <BsChatDots size={20} />
          <span>{t('navbar.message')}</span>
        </NavLink>
        <NavLink className="nav-icon-item position-relative" to="/favorites">
          <BsHeart size={20} />
          <span>{i18n.language === 'ar' ? 'المفضلة' : 'Favorites'}</span>
          {favoriteCount > 0 && <span className="position-absolute badge rounded-circle" style={badgeStyle}>{favoriteCount}</span>}
        </NavLink>
        <NavLink className="nav-icon-item position-relative" to="/orders">
          <BsBoxSeam size={20} />
          <span>{t('navbar.orders')}</span>
          {ordersCount > 0 && <span className="position-absolute badge rounded-circle" style={badgeStyle}>{ordersCount}</span>}
        </NavLink>
        <NavLink className="nav-icon-item position-relative" to="/Mycart">
          <BsBag size={20} />
          <span>{t('navbar.myCart')}</span>
          {cartCount > 0 && <span className="position-absolute badge rounded-circle" style={badgeStyle}>{cartCount}</span>}
        </NavLink>

        <Dropdown align={i18n.language === 'ar' ? 'start' : 'end'} className="ms-3">
          <Dropdown.Toggle as="div" id="main-menu-dropdown" className="nav-icon-item" role="button" tabIndex={0}>
            <BsThreeDotsVertical size={20} />
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ minWidth: '220px' }} className="shadow">
            <Dropdown.Item onClick={toggleTheme} className="d-flex align-items-center gap-2">
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
              {theme === 'dark' ? (i18n.language === 'ar' ? 'الوضع الفاتح' : 'Light Mode') : (i18n.language === 'ar' ? 'الوضع الداكن' : 'Dark Mode')}
            </Dropdown.Item>
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
            <Dropdown.Item onClick={toggleLanguage} className="d-flex align-items-center gap-2">
              <FiGlobe />
              {i18n.language === 'ar' ? 'English' : 'العربية'}
            </Dropdown.Item>
<<<<<<< HEAD

            <Dropdown.Divider />

            {isLoggedIn ? (
              <Dropdown.Item onClick={handleLogout} className="d-flex align-items-center gap-2 text-danger">
                <FiLogOut /> Logout
              </Dropdown.Item>
            ) : (
              <Dropdown.Item onClick={() => navigate('/LoginPage')} className="d-flex align-items-center gap-2">
                <FiUser /> Login / Register
              </Dropdown.Item>
            )}

            <Dropdown.Divider />

            <Dropdown.Item onClick={() => navigate('/admin/login')} className="d-flex align-items-center gap-2">
              <FiShield /> Admin Login
=======
            <Dropdown.Divider />
            {isLoggedIn ? (
              <Dropdown.Item onClick={handleLogout} className="d-flex align-items-center gap-2 text-danger">
                <FiLogOut /> {i18n.language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              </Dropdown.Item>
            ) : (
              <Dropdown.Item onClick={() => navigate('/LoginPage')} className="d-flex align-items-center gap-2">
                <FiUser /> {i18n.language === 'ar' ? 'تسجيل الدخول / إنشاء حساب' : 'Login / Register'}
              </Dropdown.Item>
            )}
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => navigate('/admin/login')} className="d-flex align-items-center gap-2">
              <FiShield /> {i18n.language === 'ar' ? 'دخول المسؤول' : 'Admin Login'}
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Navbar>
  );
};

<<<<<<< HEAD
export default Navbarpayment;
=======
export default Navbarpayment;
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
