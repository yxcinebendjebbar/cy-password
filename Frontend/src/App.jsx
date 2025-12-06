import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login'; // <--- استيراد الصفحة الجديدة

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        
        {/* ربط صفحة الدخول الحقيقية */}
        <Route path="/login" element={<Login />} />
        
        {/* صفحة لوحة التحكم (سنبنيها لاحقاً) */}
        <Route path="/dashboard" element={<h1 className="text-white text-center mt-10">Welcome to Dashboard 🚀</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;