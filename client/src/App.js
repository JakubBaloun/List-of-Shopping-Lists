// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ListOfShoppingLists from './pages/ListOfShoppingLists';
import Header from './components/Header';
import { UserProvider } from './context/UserContext';
import ShoppingListDetail from './pages/ShoppingListDetail';
import { useTheme } from './context/ThemeContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'


const App = () => {
  const { isLoggedIn } = useAuth();
  const { colors } = useTheme()

  document.body.style.backgroundColor = colors.background;
  document.body.style.color = colors.text;

  return (
    <UserProvider>
      <I18nextProvider i18n={i18n}>
      <Header />
      <Routes>
        <Route path="/" element={isLoggedIn ? <ListOfShoppingLists /> : <Login />} />
        <Route path='/shopping-list/:shoppingListId' element={isLoggedIn? <ShoppingListDetail /> : <Login />} />
      </Routes>
      </I18nextProvider>
    </UserProvider>
  );
};

export default App;
