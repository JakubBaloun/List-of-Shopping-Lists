import React from 'react';
import { Navbar, Nav, Button, Container, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const Header = () => {
 const { isLoggedIn, logout } = useAuth();
 const navigate = useNavigate();
 const { darkMode, toggleDarkMode, colors } = useTheme();
 const { t, i18n } = useTranslation();

 return (
    <Navbar
      bg={darkMode ? 'dark' : 'light'}
      expand="md"
      variant={darkMode ? 'dark' : 'light'}
      style={{
        marginBottom: '20px',
        borderBottom: `1px solid ${colors.border}`,
        justifyContent: 'space-between', // Distribute items evenly
      }}
    >
      <Container>
        <Navbar.Brand>
          <Link to={'/'} style={{ textDecoration: 'none', color: colors.text, fontWeight: 'bold' }}>
            {t('listOfShoppingLists')}
          </Link>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto align-items-center justify-content-between">
            <Form.Check
              type="switch"
              id="darkModeSwitch"
              label={t('darkMode')}
              checked={darkMode}
              onChange={toggleDarkMode}
              style={{ marginLeft: '10px', color: colors.text }}
            />

            {isLoggedIn && (
              <Navbar.Text style={{ marginRight: '10px', color: colors.text }}>
                <FaUser style={{ marginRight: '5px' }} /> {localStorage.getItem('userName')}
              </Navbar.Text>
            )}

            {isLoggedIn && (
              <Button
                variant={darkMode ? 'outline-light' : 'outline-dark'}
                onClick={() => {
                 logout();
                 navigate('/');
                }}
                style={{ marginLeft: '10px' }}
              >
                <FaSignOutAlt style={{ marginRight: '5px' }} /> {t('logout')}
              </Button>
            )}
          </Nav>

          <Nav>
            <Form.Control
              as="select"
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              style={{
                marginLeft: '10px',
                color: colors.text,
                background: colors.background,
                border: `1px solid ${colors.border}`,
              }}
            >
              <option value="en">En</option>
              <option value="cs">Cz</option>
            </Form.Control>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
 );
};

export default Header;