import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ShoppingListItem from '../components/ShoppingListItem';
import ShoppingListMembers from '../components/ShoppingListMembers';
import NewItemForm from '../components/NewItemForm';
import { Form, Container, Row, Col, Spinner, Button, Offcanvas } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext'; // Import useTheme hook
import { useTranslation } from 'react-i18next';

const ShoppingListDetail = () => {
    const [shoppingList, setShoppingList] = useState(null);
    const [members, setMembers] = useState([]);
    const [showMembers, setShowMembers] = useState(false);
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [showResolved, setShowResolved] = useState(false);
    const [editName, setEditName] = useState(false);
    const [newName, setNewName] = useState('');
    const { shoppingListId } = useParams();
    const { user } = useAuth()
    const { colors } = useTheme(); // Use the useTheme hook
    const { t } = useTranslation()


  useEffect(() => {
    const fetchShoppingListData = async () => {
      try {
        // Fetch shopping list details
        const responseList = await fetch(`http://localhost:8000/api/get-shopping-list/${shoppingListId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('authToken')
          },
        });
        const dataList = await responseList.json();

        if (responseList.ok) {
          setShoppingList(dataList.data.shoppingListData);

          // Fetch shopping list members
          const responseMembers = await fetch(`http://localhost:8000/api/view-shopping-list-members/${shoppingListId}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem('authToken'),
            },
          });
          const dataMembers = await responseMembers.json();

          if (responseMembers.ok) {
            setMembers(dataMembers.data.members);
          } else {
            setError(dataMembers.message);
          }

          // Fetch shopping list items
          const responseItems = await fetch(`http://localhost:8000/api/view-shopping-list-items/${shoppingListId}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.getItem('authToken'),
            },
          });
          const dataItems = await responseItems.json();

          if (responseItems.ok) {
            setItems(dataItems.data.items);
          } else {
            setError(dataItems.message);
          }
        } else {
          setError(dataList.message);
        }
      } catch (error) {
        setError('Server error');
      }
    };

    fetchShoppingListData();
  }, [shoppingListId, showResolved, editName, newName, items]);

  const addItemToShoppingList = async (itemData) => {
    try {
      // Send a request to your server to add the item
      const response = await fetch(`http://localhost:8000/api/add-item-to-shopping-list/${shoppingListId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('authToken'),
        },
        body: JSON.stringify(itemData),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the state with the new item
        setItems((prevItems) => [...prevItems, data.data]);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Server error');
    }
  };

  const removeItemFromShoppingList = async (itemId) => {
    try {
      // Implement the logic to send a request to your server endpoint for removing an item
      const response = await fetch(`http://localhost:8000/api/remove-item-from-shopping-list/${shoppingListId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('authToken'),
        },
        body: JSON.stringify({ itemId }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // If the removal was successful, update the state to reflect the change
        setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Server error');
    }
  };

  const removeMemberFromShoppingList = async (memberId) => {
    try {
      // Send a request to your server to remove the member
      const response = await fetch(`http://localhost:8000/api/remove-member-from-shopping-list/${shoppingListId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('authToken'),
        },
        body: JSON.stringify({ memberId }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // If the removal was successful, update the state to reflect the change
        setMembers((prevMembers) => prevMembers.filter((member) => member !== memberId));
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Server error');
    }
  };

  const addUserToShoppingList = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/add-user-to-shopping-list/${shoppingListId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('authToken'),
        },
        body: JSON.stringify({ userId }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMembers((prevMembers) => [...prevMembers, data.data.userId]);
        console.log('User added successfully:', data.data);
      } else {
        // Zde můžete zpracovat případné chyby
        console.error('Error adding user to shopping list:', data.message);
      }
    } catch (error) {
      console.error('Server error:', error);
    }
  };
  
  const leaveShoppingList = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/leave-shopping-list/${shoppingListId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('authToken'),
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        // If the leave was successful, update the state to reflect the change
        setMembers((prevMembers) => prevMembers.filter((member) => member !== userId));
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Server error');
    }
  };
  
  const toggleItemResolved = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/toggle-item-resolved/${shoppingListId}`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('authToken'),
        },
        body: JSON.stringify({ itemId }),
      });

      const data = await response.json();

      if (response.ok) {
        // If the toggle was successful, update the state to reflect the change
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === itemId ? { ...item, resolved: !item.resolved } : item
          )
        );
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Server error');
    }
  };

  const handleSaveName = async () => {
    try {
      if (!newName.trim()) {
        // Check if the new name is not empty or contains only whitespace
        throw new Error('Invalid name format');
      }
  
      const response = await fetch(`http://localhost:8000/api/update-shopping-list-name/${shoppingListId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('authToken'),
        },
        body: JSON.stringify({ name: newName.trim() }), // Trim the new name
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Update the state with the new name
        setShoppingList((prevShoppingList) => ({ ...prevShoppingList, name: newName.trim() }));
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      // Turn off the edit mode and reset the new name
      setEditName(false);
      setNewName(shoppingList.name);
    }
  };
  
  
  const isUserOwner = () => {
    return shoppingList.owner === user._id;
  };

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  }

  if (!shoppingList) {
    return <Spinner />;
  }

  const handleToggleMembers = () => {
    setShowMembers(!showMembers);
  };

  
  return (
    <Container style={{background: colors.background, color: colors.text}}>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <h2>
  {editName ? (
    <>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <Button variant="success" size="sm" onClick={handleSaveName}>
        {t('save')}
      </Button>
    </>
  ) : (
    <>
      {shoppingList.name}
      {isUserOwner() && (
        <Button variant="link" size="sm" onClick={() => setEditName(true)}>
          {t('editName')}
        </Button>
      )}
    </>
  )}
</h2>
<Button variant="primary" onClick={handleToggleMembers}>
            {t('showMembers')}
          </Button>

          <Form.Check 
            type="checkbox"
            id="showResolvedCheckbox"
            label={t('showAllItems')}
            checked={showResolved}
            onChange={() => setShowResolved(!showResolved)}
          />
          <ShoppingListItem 
            items={items}
            onRemoveItem={removeItemFromShoppingList}
            onToggleItemResolved={toggleItemResolved}
            showResolved={showResolved}
          />
           <Offcanvas show={showMembers} onHide={() => setShowMembers(false)}  style={{background: colors.background, color: colors.text}}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>{t('shoppingListMembers')}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <ShoppingListMembers
                members={members}
                shoppingList={shoppingList}
                onRemoveMember={removeMemberFromShoppingList}
                onAddUser={addUserToShoppingList}
                onLeaveShoppingList={leaveShoppingList}
              />
            </Offcanvas.Body>
          </Offcanvas>
          <NewItemForm addItemToShoppingList={addItemToShoppingList} />
        </Col>
      </Row>
    </Container>
  );
};

export default ShoppingListDetail;