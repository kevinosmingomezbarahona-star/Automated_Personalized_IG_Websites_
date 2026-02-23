import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/p/:slug" element={<LandingPage />} />
        <Route path="/" element={<Navigate to="/p/demo" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
