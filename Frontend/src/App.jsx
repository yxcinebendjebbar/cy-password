import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root URL to Register page automatically */}
        <Route path="/" element={<Navigate to="/register" />} />
        
        {/* Register Page Route */}
        <Route path="/register" element={<Register />} />
        
        {/* Login Page Route (Placeholder for now) */}
        <Route path="/login" element={<h1 style={{textAlign: 'center', marginTop: '50px'}}>Login Page Coming Soon...</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;