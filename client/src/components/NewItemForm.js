import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext'
import { useTranslation } from 'react-i18next';

const NewItemForm = ({ addItemToShoppingList }) => {
  const [itemName, setItemName] = useState('');
  const { darkMode, colors } = useTheme(); // Use useTheme hook
  const { t, i18n } = useTranslation();

  const handleInputChange = (event) => {
    setItemName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if item name is not empty
    if (!itemName.trim()) {
      return;
    }

    // Call the function to add a new item
    await addItemToShoppingList({ name: itemName });

    // Clear the form after submission
    setItemName('');
  };

  return (
    <Container style={{ background: colors.background, color: colors.text, padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <h3>{t('addItem')}</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>{t('itemName')}:</Form.Label>
              <Form.Control type="text" value={itemName} onChange={handleInputChange} style={{ background: colors.background, color: colors.text }} />
            </Form.Group>
            <Button variant={darkMode ? 'outline-light' : 'outline-dark'} type="submit">
              {t('addItem')}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default NewItemForm;
