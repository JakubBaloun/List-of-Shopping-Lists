import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import{BrowserRouter} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
    <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
