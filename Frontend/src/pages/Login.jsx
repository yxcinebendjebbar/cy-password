import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSignInAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    // --- نفس المنطق القديم ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/user/login', { email, masterPasswordHash: password });
            localStorage.setItem('auth-token', res.data.token);
            sessionStorage.setItem('encryption-key', password);
            toast.success("🔓 Welcome back!");
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data || "Invalid Credentials");
        } finally {
            setLoading(false);
        }
    };
    // -------------------------

    // --- التصميم الجديد ---
    return (
        <div className="auth-container">
            <h2 className="neon-title">CONNEXION</h2>
            <p className="subtitle">Enter the 4D Secure Zone.</p>

            <form onSubmit={handleLogin}>
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

                <div className="input-group">
                    <FaLock className="icon" />
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Master Password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                    />
                    <span onClick={() => setShowPassword(!showPassword)} style={{cursor: 'pointer', color: '#00eaff'}}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <button type="submit" className="primary-btn" disabled={loading}>
                    {loading ? "Loading..." : "Continuer"} <FaSignInAlt />
                </button>
            </form>

            <hr style={{ width: '80%', margin: '25px auto', borderTop: '1px solid rgba(255,255,255,0.1)' }} />

            <Link to="/register">
                <button type="button" className="secondary-btn">
                    Create New Account
                </button>
            </Link>
        </div>
    );
};

export default Login;