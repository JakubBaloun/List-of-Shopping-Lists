import React, { useState, useEffect } from 'react';
import NewShoppingListForm from '../components/NewShoppingListForm';
import ShoppingListCard from '../components/ShoppingListCard';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import Spinner from 'react-bootstrap/Spinner'
import { Container } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext'; // Import useTheme hook
import { useTranslation } from 'react-i18next';


const ListOfShoppingLists = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterArchived, setFilterArchived] = useState(false); // New state for filtering
  const { user } = useAuth(); //logged in user
  const { users } = useUser(); // Use the useUser hook to get the list of users
  const { colors } = useTheme(); // Use the useTheme hook
  const { t, i18n } = useTranslation();


  console.log(shoppingLists);
  
    const fetchShoppingLists = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/view-all-shopping-lists');
        const data = await response.json();

        if (response.ok) {
          const shoppingListsWithOwnerNames = data.data.map((list) => {
            const owner = users.find((user) => user._id === list.owner);
            return { ...list, ownerName: owner ? owner.username : 'Unknown' };
          });
          setShoppingLists(shoppingListsWithOwnerNames);

        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };
useEffect(() =>{
    fetchShoppingLists();
  },[]);

  const deleteShoppingList = async (shoppingListId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/delete-shopping-list/${shoppingListId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('authToken')
        },
      });

      if (response.ok) {
        const updatedShoppingLists = shoppingLists.filter((list) => list._id !== shoppingListId);
        setShoppingLists(updatedShoppingLists);

      } else {
        const data = await response.json();
        console.error('Error archiving shopping list:', data.message);
      }
    } catch (error) {
      console.error('Error deleting shopping list:', error);
    }
  };

  const archiveShoppingList = async (shoppingListId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/archive-shopping-list/${shoppingListId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('authToken')
        },
      });

      if (response.ok) {
        updateShoppingList(shoppingListId);
      } else {
        const data = await response.json();
        console.error('Error archiving shopping list:', data.message);
      }
    } catch (error) {
      console.error('Error archiving shopping list:', error);
    }
  };

  const updateShoppingList = (shoppingListId) => {
    setShoppingLists((prevLists) =>
      prevLists.map((list) =>
        list._id === shoppingListId
          ? { ...list, archived: !list.archived } // Aktualizace stavu archivace
          : list
      )
    );
  };


  const userIsMemberOrOwner = (list) => {
    return (
      list.members.includes(user._id) ||
      list.owner === user._id
    );
  };

  const filteredShoppingLists = shoppingLists.filter(userIsMemberOrOwner);

  const displayShoppingLists = filterArchived
  ? filteredShoppingLists.filter((list) => list.archived)
  : filteredShoppingLists.filter((list) => !list.archived);

  return (
    <Container style={{ background: colors.background, color: colors.text, padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ maxWidth: '600px', margin: 'auto' }}>
        <h1 style={{ textAlign: 'center', color: colors.text }}>{t('listOfShoppingLists')}</h1>

        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <label style={{ fontSize: '20px', color: colors.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {t('showArchived')}
            <input
              type="checkbox"
              checked={filterArchived}
              onChange={() => setFilterArchived(!filterArchived)}
              style={{ marginLeft: '10px', height: '20px', width: '20px' }}
            />
          </label>
        </div>
      </div>

      {loading && <p style={{ textAlign: 'center' }}><Spinner animation='grow' variant='secondary' /></p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {displayShoppingLists.length > 0 ? (
        <div>
          {displayShoppingLists.map((list) => (
            <ShoppingListCard
              key={list._id}
              shoppingList={list}
              onArchive={archiveShoppingList}
              onDelete={deleteShoppingList}
            />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>{t('noListsAvailable')}</p>
      )}

      <div className='d-flex justify-content-center' style={{ marginTop: '20px',  position: 'sticky',
        bottom: 0,
        zIndex: 1000, }}>
        <NewShoppingListForm setShoppingLists={setShoppingLists} fetchShoppingLists={fetchShoppingLists} />
      </div>
    </Container>
  );
};

export default ListOfShoppingLists;
