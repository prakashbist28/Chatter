import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Chat from './pages/Chat';
import SetAvatar from './pages/SetAvatar';
import GlobalStyles from './GlobalStyles';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Chat />} />
          <Route path="/setavatar" element={<SetAvatar />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
