import React from 'react';
import { Route, Routes } from 'react-router-dom';

import RoomPage from './components/RoomPage';
import HomePage from './components/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/room/:roomId" element={<RoomPage />} />
    </Routes>
  );
}

export default App;
