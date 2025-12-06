import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // استيراد التوست
// استيراد أيقونات العين
import { FaUserShield, FaLock, FaEnvelope, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // حالة لإظهار/إخفاء الباسوورد
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/user/register', {
                email: email,
                masterPasswordHash: password 
            });
            
            // رسالة نجاح احترافية
            toast.success("🎉 Account created successfully! Please login.");
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data || "Something went wrong";
            // رسالة خطأ احترافية
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden relative">
            
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            
            <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
                
                <div className="text-center mb-8">
                    <div className="inline-block p-4 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 mb-4 shadow-lg">
                        <FaUserShield className="text-3xl text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-wide">Join SecureVault</h2>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-slate-500 transition-all"
                            required
                        />
                    </div>
                    
                    {/* حقل الباسوورد مع زر العين */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaLock className="text-slate-400 group-focus-within:text-purple-400 transition-colors" />
                        </div>
                        <input 
                            // هنا التغيير: إذا كانت showPassword صحيحة يصبح text وإلا password
                            type={showPassword ? "text" : "password"} 
                            placeholder="Master Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-slate-500 transition-all"
                            required
                            minLength={6}
                        />
                        {/* زر العين */}
                        <button
                            type="button" // مهم جداً لكي لا يعمل Submit للنموذج
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transform transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><span>Create Account</span> <FaArrowRight /></>}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-400">
                    Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold hover:underline">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;