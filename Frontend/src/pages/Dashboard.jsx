import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { encryptData, decryptData } from '../utils/encryption';
import { FaSignOutAlt, FaPlus, FaCopy, FaGlobe, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Dashboard = () => {
    const [passwords, setPasswords] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form States
    const [siteName, setSiteName] = useState('');
    const [siteUrl, setSiteUrl] = useState('');
    const [password, setPassword] = useState('');
    const [showFormPassword, setShowFormPassword] = useState(false); // للعين في نموذج الإضافة
    const [adding, setAdding] = useState(false);

    // 👇 حالة جديدة: لتخزين "آيدي" البطاقة التي نريد كشف باسووردها حالياً
    const [visiblePasswordId, setVisiblePasswordId] = useState(null);

    const navigate = useNavigate();
    const secretKey = sessionStorage.getItem('encryption-key');

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        sessionStorage.removeItem('encryption-key');
        toast.info("👋 Logged out successfully");
        navigate('/login');
    };

    const fetchVault = async () => {
        try {
            const res = await api.get('/vault/all');
            setPasswords(res.data);
        } catch (error) {
            toast.error("Failed to load passwords");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!secretKey) {
            toast.error("Security Key missing! Please login again.");
            navigate('/login');
        } else {
            fetchVault();
        }
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!siteName || !password) return toast.warning("Please fill required fields");

        setAdding(true);
        try {
            const { encryptedData, iv } = encryptData(password, secretKey);
            await api.post('/vault/add', { siteName, siteUrl, encryptedData, iv });

            toast.success("🔐 Password saved securely!");
            setSiteName('');
            setSiteUrl('');
            setPassword('');
            fetchVault();
        } catch (error) {
            toast.error("Failed to save password");
        } finally {
            setAdding(false);
        }
    };

    const copyToClipboard = (encryptedData) => {
        const originalPass = decryptData(encryptedData, secretKey);
        if (originalPass) {
            navigator.clipboard.writeText(originalPass);
            toast.success("📋 Password copied!");
        } else {
            toast.error("❌ Error decrypting");
        }
    };

    // 👇 دالة جديدة لتبديل رؤية الباسوورد داخل البطاقة
    const toggleCardPassword = (id) => {
        if (visiblePasswordId === id) {
            setVisiblePasswordId(null); // إخفاء إذا كان مفتوحاً
        } else {
            setVisiblePasswordId(id); // إظهار هذا العنصر
        }
    };

    // 👇 دالة مساعدة لفك التشفير وعرضه في البطاقة
    const getDecryptedPassword = (encryptedData) => {
        return decryptData(encryptedData, secretKey);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]"></div>
            </div>

            <nav className="relative z-10 bg-slate-800/50 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                        <FaLock className="text-xl" />
                    </div>
                    <h1 className="text-xl font-bold tracking-wide">SecureVault</h1>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition-all border border-red-500/20">
                    <FaSignOutAlt /> <span>Logout</span>
                </button>
            </nav>

            <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                
                {/* Left Side: Add Form */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl sticky top-24">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FaPlus className="text-blue-400" /> Add New Item</h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <input className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:border-blue-500 outline-none text-white" placeholder="Site Name (e.g. Facebook)" value={siteName} onChange={e => setSiteName(e.target.value)} />
                            <input className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:border-blue-500 outline-none text-white" placeholder="URL (Optional)" value={siteUrl} onChange={e => setSiteUrl(e.target.value)} />
                            
                            <div className="relative">
                                <input 
                                    type={showFormPassword ? "text" : "password"}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 pr-10 focus:border-blue-500 outline-none text-white"
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button type="button" onClick={() => setShowFormPassword(!showFormPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-white">
                                    {showFormPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            <button disabled={adding} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 rounded-lg font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50">
                                {adding ? "Saving..." : "Save Securely"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Side: Vault Cards */}
                <div className="w-full lg:w-2/3">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-2xl font-bold">My Vault</h2>
                        <span className="text-slate-400 text-sm">{passwords.length} items</span>
                    </div>

                    {loading ? <div className="text-center py-20 text-slate-500">Loading...</div> : 
                    passwords.length === 0 ? <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700 text-slate-400">Your vault is empty.</div> : 
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {passwords.map((item) => (
                            <div key={item._id} className="group bg-slate-800/40 hover:bg-slate-800/80 border border-white/5 hover:border-blue-500/30 p-5 rounded-xl transition-all duration-300">
                                
                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-lg font-bold border border-white/10">
                                            {item.siteName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight">{item.siteName}</h3>
                                            {item.siteUrl && (
                                                <a href={item.siteUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                                                    <FaGlobe /> Open Site
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Card Footer: Password Display & Actions */}
                                <div className="bg-black/20 rounded-lg p-3 flex justify-between items-center group-hover:bg-black/40 transition-colors h-12">
                                    
                                    {/* هنا السحر: إما نعرض النص أو النقاط */}
                                    <div className="font-mono text-sm truncate mr-2 select-all">
                                        {visiblePasswordId === item._id ? (
                                            <span className="text-emerald-400 font-bold">
                                                {getDecryptedPassword(item.encryptedData)}
                                            </span>
                                        ) : (
                                            <div className="flex gap-1 mt-1">
                                                {[...Array(8)].map((_, i) => (
                                                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* أزرار الإجراءات */}
                                    <div className="flex gap-1">
                                        {/* زر العين */}
                                        <button 
                                            onClick={() => toggleCardPassword(item._id)}
                                            className="text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all"
                                            title={visiblePasswordId === item._id ? "Hide Password" : "Show Password"}
                                        >
                                            {visiblePasswordId === item._id ? <FaEyeSlash /> : <FaEye />}
                                        </button>

                                        {/* زر النسخ */}
                                        <button 
                                            onClick={() => copyToClipboard(item.encryptedData)}
                                            className="text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all"
                                            title="Copy Password"
                                        >
                                            <FaCopy />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    }
                </div>
            </main>
        </div>
    );
};

export default Dashboard;