import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
// 1. استيراد مكتبة الإشعارات وملف التصميم الخاص بها
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      {/* 2. وضع الحاوية هنا لتظهر فوق كل الصفحات */}
      <ToastContainer position="top-right" theme="dark" autoClose={3000} />
      
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<h1 className="text-white text-center mt-10">Welcome to Dashboard 🚀</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;