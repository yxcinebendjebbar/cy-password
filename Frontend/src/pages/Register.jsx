import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
// استيراد الأيقونات المتوافقة مع التصميم الجديد
import { FaUserPlus, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    // --- نفس المنطق القديم تماماً ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/user/register', { email, masterPasswordHash: password });
            toast.success("🎉 Account created successfully!");
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    // -------------------------------

    // --- التصميم الجديد ---
    return (
        <div className="auth-container">
            <h2 className="neon-title">INSCRIPTION</h2>
            <p className="subtitle">Join the Secure 4D Vault.</p>

            <form onSubmit={handleRegister}>
                
                {/* حقل الإيميل */}
                <div className="input-group">
                    <FaEnvelope className="icon" />
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                    />
                </div>

                {/* حقل الباسوورد */}
                <div className="input-group">
                    <FaLock className="icon" />
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Master Password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                        minLength={6}
                    />
                    {/* أيقونة العين (قابلة للضغط) */}
                    <span onClick={() => setShowPassword(!showPassword)} style={{cursor: 'pointer', color: '#00eaff'}}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                {/* زر التسجيل */}
                <button type="submit" className="primary-btn" disabled={loading}>
                    {loading ? "Processing..." : "S'inscrire"} <FaUserPlus />
                </button>
            </form>

            {/* الفاصل */}
            <hr style={{ width: '80%', margin: '25px auto', borderTop: '1px solid rgba(255,255,255,0.1)' }} />

            {/* زر الانتقال للدخول */}
            <Link to="/login">
                <button type="button" className="secondary-btn">
                    Already have an account? Login
                </button>
            </Link>
        </div>
    );
};

export default Register;