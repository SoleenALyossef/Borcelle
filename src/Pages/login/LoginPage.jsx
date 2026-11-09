import { Form, Button, InputGroup } from 'react-bootstrap';
import { FiPhoneCall } from 'react-icons/fi';
import AuthLayout from '../../components/AuthLayout';
<<<<<<< HEAD
import { useState } from 'react';
import { useNavigate } from 'react-router';
=======
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
import { API_Config } from '../../Config/API-Config';

const LoginPage = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
=======
  const location = useLocation();

  useEffect(() => {
    if (location.state?.requiresAuth && location.state.from && location.state.from !== '/LoginPage') {
      localStorage.setItem('redirectAfterLogin', location.state.from);
    }
  }, [location.state]);
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538

  const [registerData, setRegisterData] = useState({
    field_mobile: { value: '' },
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  //  نقل السلة المحلية إلى الـ API
  const transferGuestCartToServer = () => {
<<<<<<< HEAD
    const raw = localStorage.getItem('guestCart');
    if (!raw) return Promise.resolve();

    let guestItems = [];
    try {
      guestItems = JSON.parse(raw);
    } catch {
      return Promise.resolve();
    }
=======
    const raw = sessionStorage.getItem('guestCart');
    if (!raw) return Promise.resolve();

    let parsedItems;
    try {
      parsedItems = JSON.parse(raw);
    } catch {
      return Promise.resolve();
    }
    const guestItems = Array.isArray(parsedItems) ? parsedItems : [];
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
    if (!guestItems.length) return Promise.resolve();

    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const promises = guestItems.map((item) =>
      fetch(`${API_Config.BASE_URL}/cart`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          product_id: item.product_id || item.product?.id,
          quantity: item.quantity || 1,
        }),
      })
    );

    return Promise.all(promises)
      .then(() => {
<<<<<<< HEAD
        localStorage.removeItem('guestCart');
=======
        sessionStorage.removeItem('guestCart');
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
        console.log('Guest cart transferred ');
      })
      .catch((err) => console.error('Transfer error:', err));
  };

  const handleRegisteration = (e) => {
    e.preventDefault();
    setError('');

    const mobileValue = registerData.field_mobile.value;

    if (!mobileValue) {
      setError('Please enter your phone number');
      return;
    }
    if (!mobileValue.startsWith('09')) {
      setError('Phone must start with 09');
      return;
    }
    if (isNaN(mobileValue)) {
      setError('Phone must contain numbers only');
      return;
    }
    if (mobileValue.length < 10) {
      setError('Phone must be at least 10 digits');
      return;
    }
    if (mobileValue.length > 10) {
      setError('Phone must be exactly 10 digits');
      return;
    }

    setLoading(true);
    const url = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.LOGIN}`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ phone: mobileValue }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((serverError) => {
            throw new Error(serverError.message || 'Login error');
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log('Success:', data);

        if (data?.data?.token) {
          localStorage.setItem('token', data.data.token);
<<<<<<< HEAD
=======
          window.dispatchEvent(new Event('customer-auth-changed'));
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538
        }
        localStorage.setItem('phone', mobileValue);

        //  نقل سلة guest ثم الانتقال
        return transferGuestCartToServer();
      })
      .then(() => {
        navigate('/Verification');
      })
      .catch((err) => {
        console.log(err);
        setError(err.message || 'Something went wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AuthLayout>
      <h3 className="form-title">Welcome!</h3>
      <p className="form-subtitle">Please Log in to continue</p>
<<<<<<< HEAD
=======
      {location.state?.requiresAuth && (
        <div className="alert alert-warning small" role="alert">
          {localStorage.getItem('lang') === 'ar'
            ? 'يجب تسجيل الدخول أولاً للوصول إلى هذه الصفحة.'
            : 'Please log in first to access this page.'}
        </div>
      )}
>>>>>>> 0d47c315e1710745dd8448458dfcf8f0f21ee538

      <Form onSubmit={handleRegisteration}>
        <InputGroup className="custom-input-group">
          <Form.Control
            placeholder="Add number"
            className="custom-input"
            type="tel"
            value={registerData.field_mobile.value}
            onInput={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setRegisterData({ field_mobile: { value: val } });
            }}
          />
          <InputGroup.Text className="custom-input-icon">
            <FiPhoneCall />
          </InputGroup.Text>
        </InputGroup>

        {error && <div className="text-danger mt-2 small alert alert-warning">{error}</div>}

        <Button
          type="submit"
          disabled={loading}
          className="btn-primary-custom shadow-drop-2-center w-100 mt-3 mb-4"
        >
          {loading ? 'Submiting...' : 'Log in'}
        </Button>
      </Form>
    </AuthLayout>
  );
};

export default LoginPage;