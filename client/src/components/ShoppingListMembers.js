import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { Button, Form, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const ShoppingListMembers = ({ members, shoppingList, onRemoveMember, onAddUser, onLeaveShoppingList }) => {
  const { user } = useAuth();
  const { users } = useUser();
  const { colors } = useTheme(); // Use the useTheme hook
  const [selectedUser, setSelectedUser] = useState(null);
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const isUserOwner = () => {
    return shoppingList.owner === user._id;
  };

  const isUserMember = () => {
    return members.includes(user._id);
  };

  const handleRemoveMember = (username) => {
    onRemoveMember(username);
  };

  const handleAddUser = async () => {
    if (!selectedUser) {
      return;
    }

    await onAddUser(selectedUser._id);
    setSelectedUser(null);
  };

  const handleLeaveShoppingList = () => {
    if (isUserMember()) {
      onLeaveShoppingList(user._id);
      navigate('/');
    }
  };

  return (
    <div style={{ background: colors.background, color: colors.text, padding: '10px', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h3 style={{ color: colors.text }}>{t('shoppingListMembers')}:</h3>
      <ul>
        {members.map((memberId) => {
          const user = users.find((user) => user._id === memberId);
          return (
            <li key={memberId}>
              {user ? user.username : 'Unknown User'}
              {isUserOwner() && (
                <Button variant="danger" size="sm" onClick={() => handleRemoveMember(memberId)} style={{ marginLeft: '5px' }}>
                  {t('remove')}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      {isUserOwner() && (
        <Form>
          <Form.Group controlId="newMemberUsername">
            <Form.Label>{t('addNewMember')}:</Form.Label>
            <Dropdown onSelect={(userId) => setSelectedUser(users.find((user) => user._id === userId))}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {selectedUser ? selectedUser.username : t('chooseUser')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {users.map((user) => (
                  <Dropdown.Item key={user._id} eventKey={user._id}>
                    {user.username}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          <Button variant="primary" onClick={handleAddUser}>
            {t('addMember')}
          </Button>
        </Form>
      )}
      {isUserMember() && (
        <Button variant="danger" size="sm" onClick={handleLeaveShoppingList} style={{ marginTop: '10px' }}>
          Leave List
        </Button>
      )}
    </div>
  );
};

export default ShoppingListMembers;
