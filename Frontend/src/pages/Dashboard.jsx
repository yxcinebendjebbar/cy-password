import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { encryptData, decryptData } from '../utils/encryption';
import { FaSignOutAlt, FaPlus, FaCopy, FaSearch, FaGlobe, FaLock } from 'react-icons/fa';

const Dashboard = () => {
    const [passwords, setPasswords] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form States
    const [siteName, setSiteName] = useState('');
    const [siteUrl, setSiteUrl] = useState('');
    const [password, setPassword] = useState('');
    const [adding, setAdding] = useState(false);

    const navigate = useNavigate();

    // 1. جلب مفتاح التشفير من الذاكرة المؤقتة
    const secretKey = sessionStorage.getItem('encryption-key');

    // 2. دالة الخروج (Logout)
    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        sessionStorage.removeItem('encryption-key'); // نمسح المفتاح للأمان
        toast.info("👋 Logged out successfully");
        navigate('/login');
    };

    // 3. دالة جلب البيانات من السيرفر
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

    // تشغيل عند فتح الصفحة
    useEffect(() => {
        if (!secretKey) {
            toast.error("Security Key missing! Please login again.");
            navigate('/login');
        } else {
            fetchVault();
        }
    }, []);

    // 4. دالة إضافة باسوورد جديد
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!siteName || !password) return toast.warning("Please fill required fields");

        setAdding(true);
        try {
            // التشفير في الفرونت إند!
            const { encryptedData, iv } = encryptData(password, secretKey);

            await api.post('/vault/add', {
                siteName,
                siteUrl,
                encryptedData,
                iv
            });

            toast.success("🔐 Password saved securely!");
            setSiteName('');
            setSiteUrl('');
            setPassword('');
            fetchVault(); // تحديث القائمة
        } catch (error) {
            toast.error("Failed to save password");
        } finally {
            setAdding(false);
        }
    };

    // 5. دالة النسخ (فك التشفير ثم النسخ)
    const copyToClipboard = (encryptedData, iv) => {
        // إذا كان الباك إند يرسل الـ IV بشكل منفصل نستخدمه، وإلا فالتشفير يحتوي عليه
        // ملاحظة: دالتنا decryptData ذكية وتعرف كيف تتعامل
        const originalPass = decryptData(encryptedData, secretKey);
        
        if (originalPass) {
            navigator.clipboard.writeText(originalPass);
            toast.success("📋 Password copied to clipboard!");
        } else {
            toast.error("❌ Decryption failed! Key mismatch.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]"></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-10 bg-slate-800/50 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                        <FaLock className="text-xl" />
                    </div>
                    <h1 className="text-xl font-bold tracking-wide">SecureVault</h1>
                </div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition-all border border-red-500/20"
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </nav>

            <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                
                {/* Left Side: Add Password Form */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-slate-800/50 backdrop-blur-md border border-white/10 p-6 rounded-2xl sticky top-24">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <FaPlus className="text-blue-400" /> Add New Item
                        </h2>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="text-slate-400 text-sm block mb-1">Site Name</label>
                                <input 
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="e.g. Facebook"
                                    value={siteName}
                                    onChange={e => setSiteName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-slate-400 text-sm block mb-1">Website URL (Optional)</label>
                                <input 
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="https://..."
                                    value={siteUrl}
                                    onChange={e => setSiteUrl(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-slate-400 text-sm block mb-1">Password</label>
                                <input 
                                    type="password"
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="Secret Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                            <button 
                                disabled={adding}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 rounded-lg font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
                            >
                                {adding ? "Encrypting & Saving..." : "Save Securely"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Side: Passwords Grid */}
                <div className="w-full lg:w-2/3">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-2xl font-bold">My Vault</h2>
                        <span className="text-slate-400 text-sm">{passwords.length} items stored</span>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-slate-500">Loading your vault...</div>
                    ) : passwords.length === 0 ? (
                        <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
                            <p className="text-slate-400">Your vault is empty. Add your first password!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {passwords.map((item) => (
                                <div key={item._id} className="group bg-slate-800/40 hover:bg-slate-800/80 border border-white/5 hover:border-blue-500/30 p-5 rounded-xl transition-all duration-300">
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
                                    
                                    <div className="bg-black/20 rounded-lg p-3 flex justify-between items-center group-hover:bg-black/40 transition-colors">
                                        <div className="flex gap-1">
                                            {[...Array(8)].map((_, i) => (
                                                <div key={i} className="w-2 h-2 rounded-full bg-slate-500"></div>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => copyToClipboard(item.encryptedData, item.iv)}
                                            className="text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all"
                                            title="Copy Password"
                                        >
                                            <FaCopy />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default Dashboard;