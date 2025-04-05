import React from 'react';
import { Route, Routes } from 'react-router-dom';

import RoomPage from './components/RoomPage';
import HomePage from './components/HomePage';
import Test from './components/Test';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/room/:roomId" element={<RoomPage />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}

export default App;
