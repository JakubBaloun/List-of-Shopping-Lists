import React, { useState } from 'react';
import { Modal, Button, Form, Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import CloseButton from 'react-bootstrap/CloseButton';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const NewShoppingListForm = ({ setShoppingLists, fetchShoppingLists }) => {
  const { user } = useAuth(); //logged in user
  const { users } = useUser(); //all users
  const { darkMode, colors } = useTheme(); // Use useTheme hook
  const [newListName, setNewListName] = useState('');
  const [newMembers, setNewMembers] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [itemList, setItemList] = useState([]);
  const [show, setShow] = useState(false);
  const { t, i18n } = useTranslation();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (newListName.trim() === '') {
      alert(t('noEmptyName'));
      return;
    }

    const isUserLoggedInUser = newMembers.some((member) => member._id === user._id);

    if (isUserLoggedInUser) {
      alert(t('ownerIsMember'));
      return;
    }

    const newItemList = itemList.map((item) => ({ name: item.name, resolved: item.resolved }));

    const newList = {
      name: newListName,
      members: newMembers.map((user) => user._id),
      items: newItemList,
    };

    try {
      const response = await fetch('http://localhost:8000/api/create-shopping-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('authToken'),
        },
        body: JSON.stringify(newList),
      });

      const data = await response.json();

      if (response.ok) {
        setShoppingLists((prevLists) => [...prevLists, data.data]);
        fetchShoppingLists();
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error creating shopping list:', error);
    }

    // Reset form state
    setNewListName('');
    setNewMembers([]);
    setNewItemName('');
    setItemList([]);
    setShow(false);
  };

  const handleRemoveUser = (userId) => {
    setNewMembers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
  };

  const handleClose = () => {
    setNewListName('');
    setNewMembers([]);
    setNewItemName('');
    setShow(false);
  };

  const isUserSelected = (userId) => newMembers.some((user) => user.id === userId);

  const handleAddItem = () => {
    if (newItemName.trim() !== '') {
      setItemList((prevItemList) => [...prevItemList, { name: newItemName, resolved: false }]);
      setNewItemName('');
    }
  };

  const handleRemoveItem = (index) => {
    setItemList((prevItemList) => prevItemList.filter((_, i) => i !== index));
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Button variant={darkMode ? 'secondary' : 'dark'} onClick={() => setShow(true)}>
        {t('createNewList')}
      </Button>
      <Modal show={show} onHide={handleClose} style={{color: colors.text}}>
        <Modal.Header closeButton style={{background: colors.background, color: colors.text}}>
          <Modal.Title>{t('createNewList')}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{background: colors.background, color: colors.text}}>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group>
              <Form.Label style={{color: colors.text}}>{t('nameOfShoppingList')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('nameOfShoppingList')}
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                style={{ background: colors.background, color: colors.text }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label style={{color: colors.text}}>{t('chooseUser')}</Form.Label>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  {t('chooseUser')}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {users.map((user) => (
                    <Dropdown.Item
                      key={user._id}
                      onClick={() => {
                        if (!isUserSelected(user._id.toString())) {
                          setNewMembers((prevUsers) => [...prevUsers, user]);
                        }
                      }}
                      style={{ background: colors.background, color: colors.text }}
                    >
                      {user.username}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
            <div>
              <strong>{t('chosenUsers')}:</strong>
              <ul>
                {newMembers.map((user) => (
                  <li key={user._id}>
                    {user.username} <CloseButton onClick={() => handleRemoveUser(user._id)} />
                  </li>
                ))}
              </ul>
            </div>
            <Form.Group>
              <Form.Label>{t('itemName')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('itemName')}
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                style={{ background: colors.background, color: colors.text }}
              />
              <Button variant={darkMode ? 'outline-light' : 'outline-dark'} onClick={handleAddItem}>
                {t('addItem')}
              </Button>
            </Form.Group>
            <div>
              <strong>{t('newItems')}:</strong>
              <ul>
                {itemList.map((item, index) => (
                  <li key={index}>
                    {item.name}{' '}
                    <CloseButton onClick={() => handleRemoveItem(index)}></CloseButton>
                  </li>
                ))}
              </ul>
            </div>
            <Button variant="secondary" onClick={handleClose} style={{ marginRight: '10px' }}>
              {t('close')}
            </Button>
            <Button variant={darkMode ? 'outline-light' : 'outline-dark'} type="submit">
              {t('create')}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NewShoppingListForm;
