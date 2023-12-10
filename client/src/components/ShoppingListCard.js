import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { CardText, Button, Modal } from 'react-bootstrap';
import { FaTrash, FaBox } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import useTheme hook
import { useTranslation } from 'react-i18next';

const ShoppingListCard = ({ shoppingList, onDelete, onArchive }) => {
  const [show, setShow] = useState(false);
  const { user } = useAuth();

  // Use the useTheme hook to get dark mode state and colors
  const { darkMode, colors } = useTheme();
  const { t, i18n } = useTranslation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const itemsNum = shoppingList.items;
  const owner = shoppingList.ownerName;

  const userIsOwner = (shoppingList) => {
    return shoppingList.owner === user._id;
  };

  const isNotArchived = shoppingList.archived;

  const isUserOwner = userIsOwner(shoppingList);

  const handleDelete = async () => {
    try {
      await onDelete(shoppingList._id);
    } catch (error) {
      console.error('Error deleting shopping list:', error);
    }
  };

  const handleArchive = async () => {
    try {
      await onArchive(shoppingList._id);
    } catch (error) {
      console.error('Error archiving shopping list:', error);
    }
  };

  return (
    <>
      <Card style={{ margin: '10px', padding: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', background: colors.background, color: colors.text }}>
        <Card.Body>
          <Link to={`/shopping-list/${shoppingList._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card.Title>{shoppingList?.name}</Card.Title>
            <CardText>{t('items')}: {itemsNum.length}</CardText>
            <CardText>{t('owner')}: {owner}</CardText>
          </Link>
          {isUserOwner ? (
            <div>
              <Button variant='outline' onClick={handleShow}>
                <CardText>
                  <FaTrash icon="fa-htin fa-trash" style={{ color: "#ff0000", }} />
                </CardText>
              </Button>
              {!isNotArchived ? <Button variant='outline' onClick={handleArchive}>
                <CardText>
                  <FaBox icon="fa-thin fa-trash" />
                </CardText>
              </Button> : null}
            </div>
          ) : null}
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose}  style={{color: colors.text}}>
        <Modal.Header closeButton style={{background: colors.background, color: colors.text}}>
        </Modal.Header>
        <Modal.Body style={{background: colors.background, color: colors.text}}>{t('delConfirmation')}"{shoppingList.name}"?</Modal.Body>
        <Modal.Footer style={{background: colors.background, color: colors.text}}>
          <Button variant={darkMode ? "light" : "dark"} onClick={handleClose}>
            {t('cancel')}
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            {t('delete')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ShoppingListCard;
