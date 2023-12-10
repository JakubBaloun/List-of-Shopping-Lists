import React, { useState } from 'react';
import { Container, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const PasswordToggleIcon = ({ passwordShown, onToggle, colors }) => (
  <span
    onClick={onToggle}
    style={{
      cursor: 'pointer',
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: colors.text, // Use text color from theme
    }}
  >
    {passwordShown ? <FaEyeSlash /> : <FaEye />}
  </span>
);

const Registration = ({ setRegistration }) => {
  const [username, setUsername] = useState('');
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [registrationPassword, setRegistrationPassword] = useState('');
  const [registrationPasswordShown, setRegistrationPasswordShown] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();

  const toggleRegistrationPassword = () => {
    setRegistrationPasswordShown(!registrationPasswordShown);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setRegistrationLoading(true);
    setRegistrationError(null);

    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email: registrationEmail, password: registrationPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        setRegistration(false)
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setRegistrationError(error.message);
    } finally {
      setRegistrationLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '300px', background: colors.background, color: colors.text }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">{t('registration')}</Card.Title>

          {registrationError && <Alert variant="danger">{registrationError}</Alert>}

          <Form onSubmit={handleRegistration}>
            <Form.Group controlId="formBasicUsername">
              <Form.Label style={{color: colors.text}}>{t('username')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('enterUsername')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ background: colors.background, color: colors.text, borderColor: colors.text }}
              />
            </Form.Group>

            <Form.Group controlId="formBasicRegistrationEmail">
              <Form.Label style={{color: colors.text}}>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder={t('enterEmail')}
                value={registrationEmail}
                onChange={(e) => setRegistrationEmail(e.target.value)}
                required
                style={{ background: colors.background, color: colors.text, borderColor: colors.text }}
              />
            </Form.Group>

            <Form.Group controlId="formBasicRegistrationPassword" position="relative">
              <Form.Label style={{color: colors.text}}>{t('password')}</Form.Label>
              <Form.Control
                type={registrationPasswordShown ? 'text' : 'password'}
                placeholder={t('password')}
                value={registrationPassword}
                onChange={(e) => setRegistrationPassword(e.target.value)}
                required
                style={{ background: colors.background, color: colors.text, borderColor: colors.text }}
              />
              <PasswordToggleIcon passwordShown={registrationPasswordShown} onToggle={toggleRegistrationPassword} colors={colors} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3" disabled={registrationLoading}>
              {registrationLoading ? <Spinner animation="border" size="sm" /> : t('register')}
            </Button>
            <div>
              <p
                className="d-flex justify-content-center text-align-center"
                onClick={() => setRegistration(false)}
                style={{ color: colors.text }}
              >
                {t('account')}
              </p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Registration;
