import { FiMenu } from 'react-icons/fi';
import Navbarpayment from '../Pages/PaymentMethod/Navbarpayment';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import '../App.css';

const MainNavbar = () => {
  const { t } = useTranslation();
  const [isNavVisible, setIsNavVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      lastScrollY = window.scrollY;
    };
    const handleMouseMove = (e) => {
      if (e.clientY <= 60) setIsNavVisible(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <header className={`main-header-wrapper ${!isNavVisible ? 'nav-hidden' : ''}`}>
      <Navbarpayment />
      <div className="sub-navbar d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-4 flex-wrap">
          <span className="sub-nav-link fw-semibold">
            <FiMenu size={18} />
            {t('navbar.allCategory')}
          </span>
          <NavLink className="sub-nav-link" to="/ProductListing">
            {t('navbar.products')}
          </NavLink>
        </div>
  
      </div>
    </header>
  );
};

export default MainNavbar;