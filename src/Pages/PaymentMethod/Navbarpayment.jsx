import { Navbar, Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import { BsBag, BsHeart, BsPerson, BsChatDots, BsBoxSeam, BsThreeDotsVertical } from 'react-icons/bs';
import { FiMoon, FiSun, FiGlobe, FiUser, FiLogOut, FiShield } from 'react-icons/fi';
import logoimg from '../../assets/image/Black and Red Online Store Logo 1.png';
import './Checkout.css';
import { NavLink, useNavigate } from 'react-router';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const Navbarpayment = () => {
  const { cartCount, favoriteCount, ordersCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // مراقبة حالة تسجيل الدخول
  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!localStorage.getItem('token'));
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('phone');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userImage');
    setIsLoggedIn(false);
    navigate('/');
    window.location.reload();
  };

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
    padding: '3 6px'
  };

  return (
    <Navbar expand="lg" className="main-header d-flex justify-content-between align-items-center">
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

      <div className="d-flex align-items-center">
        <NavLink className="nav-icon-item" to="/ProfilePage">
          <BsPerson size={20} />
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

            <Dropdown.Item onClick={toggleLanguage} className="d-flex align-items-center gap-2">
              <FiGlobe />
              {i18n.language === 'ar' ? 'English' : 'العربية'}
            </Dropdown.Item>

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
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default Navbarpayment;