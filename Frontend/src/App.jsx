import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* الصفحة الرئيسية توجهك للتسجيل تلقائياً */}
        <Route path="/" element={<Navigate to="/register" />} />
        
        {/* صفحة التسجيل */}
        <Route path="/register" element={<Register />} />
        
        {/* صفحة الدخول (سنبنيها لاحقاً، حالياً نضع نص مؤقت) */}
        <Route path="/login" element={<h1>صفحة تسجيل الدخول قريباً...</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;