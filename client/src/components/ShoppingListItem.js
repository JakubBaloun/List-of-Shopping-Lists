import React from 'react';
import { Button, Form, ListGroup, ListGroupItem } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const ShoppingListItem = ({ items, onRemoveItem, onToggleItemResolved, showResolved }) => {
  const { colors } = useTheme(); 
  const { t, i18n } = useTranslation();

  const handleRemoveItem = (itemId) => {
    onRemoveItem(itemId);
  };

  const handleToggleItemResolved = (itemId) => {
    onToggleItemResolved(itemId);
  };

  const filteredItems = showResolved ? items : items.filter(item => !item.resolved);

  return (
    <div>
      <h3 style={{ color: colors.text }}>{t('shoppingListItems')}:</h3>
      <ListGroup>
        {filteredItems.map((item) => (
          <ListGroupItem key={item._id} style={{ background: colors.background, color: colors.text }}>
            <Form.Check
              inline
              type="checkbox"
              checked={item.resolved}
              onChange={() => handleToggleItemResolved(item._id)}
              style={{ color: colors.text }}
            />
            {item.name}
            <Button variant="outline-danger" onClick={() => handleRemoveItem(item._id)} style={{ float: 'right', color: colors.text }}>
              <FaTrash />
            </Button>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

export default ShoppingListItem;
