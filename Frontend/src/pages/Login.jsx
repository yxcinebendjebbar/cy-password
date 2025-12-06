import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUnlock, FaLock, FaEnvelope, FaArrowRight } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. إرسال طلب الدخول
            const res = await api.post('/user/login', {
                email: email,
                masterPasswordHash: password 
            });

            // 2. حفظ التوكن (للباك إند)
            localStorage.setItem('auth-token', res.data.token);

            // 3. حفظ مفتاح التشفير (للفرونت إند) - مهم جداً لفك التشفير
            // نستخدم sessionStorage ليمسح تلقائياً عند إغلاق المتصفح للأمان
            sessionStorage.setItem('encryption-key', password);

            // 4. التوجيه للخزنة
            navigate('/dashboard');

        } catch (err) {
            const msg = err.response?.data || "Invalid Email or Password";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden relative">
            
            {/* Background Animations */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
                
                <div className="text-center mb-8">
                    <div className="inline-block p-4 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 mb-4 shadow-lg">
                        <FaUnlock className="text-3xl text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-wide">Welcome Back</h2>
                    <p className="text-slate-400 mt-2 text-sm">Unlock your secure vault</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                        </div>
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500 transition-all"
                            required
                        />
                    </div>
                    
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                        </div>
                        <input 
                            type="password" 
                            placeholder="Master Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500 transition-all"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? "Unlocking..." : <><span>Open Vault</span> <FaArrowRight /></>}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline transition-all">
                        Create one
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;