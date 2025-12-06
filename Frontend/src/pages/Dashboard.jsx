import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { encryptData, decryptData } from '../utils/encryption';
import { FaSignOutAlt, FaPlus, FaCopy, FaGlobe, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Dashboard = () => {
    // --- (نفس المنطق السابق تماماً - لم نغير شيئاً هنا) ---
    const [passwords, setPasswords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [siteName, setSiteName] = useState('');
    const [siteUrl, setSiteUrl] = useState('');
    const [password, setPassword] = useState('');
    const [showFormPassword, setShowFormPassword] = useState(false); 
    const [adding, setAdding] = useState(false);
    const [visiblePasswordId, setVisiblePasswordId] = useState(null);
    const navigate = useNavigate();
    const secretKey = sessionStorage.getItem('encryption-key');

    const handleLogout = () => {
        localStorage.removeItem('auth-token');
        sessionStorage.removeItem('encryption-key');
        toast.info("👋 See you soon!");
        navigate('/login');
    };

    const fetchVault = async () => {
        try {
            const res = await api.get('/vault/all');
            setPasswords(res.data);
        } catch (error) {
            toast.error("Failed to load vault");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!secretKey) {
            toast.error("Security Key missing!");
            navigate('/login');
        } else {
            fetchVault();
        }
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!siteName || !password) return toast.warning("Fill required fields!");
        setAdding(true);
        try {
            const { encryptedData, iv } = encryptData(password, secretKey);
            await api.post('/vault/add', { siteName, siteUrl, encryptedData, iv });
            toast.success("🔐 Secured & Saved!");
            setSiteName(''); setSiteUrl(''); setPassword('');
            fetchVault();
        } catch (error) {
            toast.error("Save failed");
        } finally {
            setAdding(false);
        }
    };

    const copyToClipboard = (encryptedData) => {
        const originalPass = decryptData(encryptedData, secretKey);
        if (originalPass) {
            navigator.clipboard.writeText(originalPass);
            toast.success("📋 Copied to clipboard!");
        } else {
            toast.error("❌ Decryption error");
        }
    };

    const toggleCardPassword = (id) => {
        setVisiblePasswordId(visiblePasswordId === id ? null : id);
    };
    // ----------------------------------------------------

    // --- (التصميم الجديد - HTML) ---
    return (
        <div style={{ minHeight: '100vh', width: '100%' }}> {/* للتأكد من الخلفية */}
            
            {/* 1. Navbar الزجاجي */}
            <nav className="glass-nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px', filter: 'drop-shadow(0 0 5px #00eaff)' }} />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', textShadow: '0 0 10px rgba(0,234,255,0.5)' }}>
                        Secure<span style={{ color: '#00eaff' }}>Vault</span>
                    </h1>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                    Logout <FaSignOutAlt />
                </button>
            </nav>

            {/* 2. المحتوى الرئيسي */}
            <div className="dashboard-layout">
                
                {/* الجزء الأيسر: لوحة الإضافة */}
                <div className="add-panel">
                    <h2 className="neon-title" style={{ fontSize: '1.8em', borderBottom: 'none', textAlign: 'left' }}>
                        <FaPlus style={{ marginRight: '10px' }} /> New Item
                    </h2>
                    
                    <form onSubmit={handleAdd} style={{ marginTop: '20px' }}>
                        {/* حقل اسم الموقع */}
                        <div className="input-group">
                            <FaGlobe className="icon" />
                            <input 
                                placeholder="Site Name (e.g. Facebook)" 
                                value={siteName} onChange={e => setSiteName(e.target.value)} 
                            />
                        </div>

                        {/* حقل الرابط */}
                        <div className="input-group">
                            <FaGlobe className="icon" style={{ color: '#a0a0b0' }} />
                            <input 
                                placeholder="URL (Optional)" 
                                value={siteUrl} onChange={e => setSiteUrl(e.target.value)} 
                            />
                        </div>

                        {/* حقل الباسوورد */}
                        <div className="input-group">
                            <FaLock className="icon" />
                            <input 
                                type={showFormPassword ? "text" : "password"}
                                placeholder="Secret Password" 
                                value={password} onChange={e => setPassword(e.target.value)} 
                            />
                            <span onClick={() => setShowFormPassword(!showFormPassword)} style={{cursor: 'pointer', color: '#00eaff'}}>
                                {showFormPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <button type="submit" className="primary-btn" disabled={adding}>
                            {adding ? "Encrypting..." : "Save to Vault"}
                        </button>
                    </form>
                </div>

                {/* الجزء الأيمن: شبكة البطاقات */}
                <div className="vault-grid">
                    {/* العنوان */}
                    <div style={{ gridColumn: '1 / -1', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>My Vault</h2>
                        <span style={{ color: '#00eaff', background: 'rgba(0, 234, 255, 0.1)', padding: '5px 15px', borderRadius: '15px' }}>
                            {passwords.length} Items
                        </span>
                    </div>

                    {loading ? <p style={{textAlign: 'center', gridColumn: '1/-1'}}>Loading Vault...</p> : 
                    passwords.length === 0 ? <p style={{textAlign: 'center', gridColumn: '1/-1', color: '#888'}}>Vault is empty. Add your first secret!</p> : 
                    
                    passwords.map((item) => (
                        <div key={item._id} className="vault-card">
                            {/* رأس البطاقة */}
                            <div className="card-header">
                                <div className="site-icon">
                                    {item.siteName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{item.siteName}</h3>
                                    {item.siteUrl && (
                                        <a href={item.siteUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#00eaff', textDecoration: 'none' }}>
                                            Visit Site ↗
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* منطقة الباسوورد */}
                            <div className="password-display">
                                <div className="password-text">
                                    {visiblePasswordId === item._id ? (
                                        decryptData(item.encryptedData, secretKey)
                                    ) : (
                                        <span className="dots">••••••••</span>
                                    )}
                                </div>
                                
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button 
                                        className="icon-btn eye" 
                                        onClick={() => toggleCardPassword(item._id)}
                                        title={visiblePasswordId === item._id ? "Hide" : "Show"}
                                    >
                                        {visiblePasswordId === item._id ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                    <button 
                                        className="icon-btn copy" 
                                        onClick={() => copyToClipboard(item.encryptedData)}
                                        title="Copy"
                                    >
                                        <FaCopy />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;