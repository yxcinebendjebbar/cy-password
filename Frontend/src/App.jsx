import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// استيراد الصفحات
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // 👈 (1) استيراد الصفحة الجديدة

function App() {
  return (
    <BrowserRouter>
      {/* حاوية الإشعارات */}
      <ToastContainer position="top-right" theme="dark" autoClose={3000} />
      
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* 👇 (2) هنا التغيير: استبدلنا النص بـ <Dashboard /> */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;