import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserShield, FaLock, FaEnvelope, FaArrowRight } from 'react-icons/fa';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/user/register', {
                email: email,
                masterPasswordHash: password 
            });
            alert("✅ Account created successfully! Please login.");
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data || "Something went wrong";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            
            <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
                <div className="text-center mb-8">
                    <div className="inline-block p-4 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 mb-4 shadow-lg">
                        <FaUserShield className="text-3xl text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-wide">Join SecureVault</h2>
                </div>

                {error && <div className="mb-4 p-3 bg-red-500/20 text-red-200 rounded text-sm text-center">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-slate-400" />
                        </div>
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                            required
                        />
                    </div>
                    
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-slate-400" />
                        </div>
                        <input 
                            type="password" 
                            placeholder="Master Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                            required
                            minLength={6}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2"
                    >
                        {loading ? "Processing..." : <><span>Create Account</span> <FaArrowRight /></>}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-400">
                    Already have an account? <Link to="/login" className="text-blue-400 font-semibold hover:underline">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;