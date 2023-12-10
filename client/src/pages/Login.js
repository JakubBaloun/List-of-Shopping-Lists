// Importujte potřebné komponenty a ikony
import React, { useState } from 'react';
import { Container, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Registration from '../components/Register';
import { useTheme } from '../context/ThemeContext'; // Import useTheme hook
import { useTranslation } from 'react-i18next';

const PasswordToggleIcon = ({ passwordShown, onToggle }) => (
  <span onClick={onToggle} style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
    {passwordShown ? <FaEyeSlash /> : <FaEye />}
  </span>
);

const Login = () => {
  const { login } = useAuth();
  const { colors } = useTheme(); // Use the useTheme hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registration, setRegistration] = useState(false)
  const { t, i18n } = useTranslation();

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userName', data.data.user.username)
        login(data.data.user);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
     registration ? 
     <Registration setRegistration={setRegistration}/> :
     <Container className="d-flex justify-content-center align-items-center vh-100" style={{ background: colors.background, color: colors.text }}>
     <Card style={{ width: '300px', background: colors.background, color: colors.text, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
       <Card.Body>
         <Card.Title className="text-center mb-4" style={{ color: colors.text }}>Login</Card.Title>

         {error && <Alert variant="danger">{error}</Alert>}

         <Form onSubmit={handleLogin}>
           <Form.Group controlId="formBasicEmail">
             <Form.Label style={{color: colors.text}}>Email</Form.Label>
             <Form.Control
               type="email"
               placeholder={t('enterEmail')}
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
               style={{ background: colors.background, color: colors.text, borderColor: colors.text }}
             />
           </Form.Group>

           <Form.Group controlId="formBasicPassword" position="relative">
  <Form.Label style={{color: colors.text}}>{t('password')}</Form.Label>
  <Form.Control
  type={passwordShown ? 'text' : 'password'}
  placeholder={t('password')}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
  style={{
    background: colors.background,
    color: colors.text,
    borderColor: colors.text,
    paddingRight: '40px', 
  }}
/>

  <PasswordToggleIcon 
    passwordShown={passwordShown} 
    onToggle={togglePassword} 
    style={{ 
      position: 'absolute', 
      top: '50%', 
      right: '10px', 
      transform: 'translateY(-50%)' // Centruje ikonu ve výšce inputu
    }} 
  />
</Form.Group>


           <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading} style={{ background: colors.buttonBackground, borderColor: colors.buttonBorder }}>
             {loading ? <Spinner animation="border" size="sm" /> : t('login')}
           </Button>

           <p className='d-flex justify-content-center' onClick={() => setRegistration(true)} style={{ color: colors.text }}>{t('noAccount')}</p>
         </Form>
       </Card.Body>
     </Card>
   </Container>
 );
};

export default Login;