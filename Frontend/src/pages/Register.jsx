import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

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
            // Sending data to backend
            await api.post('/user/register', {
                email: email,
                masterPasswordHash: password 
            });

            // Success message in English
            alert("✅ Account created successfully! Please login.");
            navigate('/login');

        } catch (err) {
            // Error message in English
            const msg = err.response?.data || "Something went wrong";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Create New Account 🔐</h2>
                
                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleRegister} style={styles.form}>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Master Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                        minLength={6}
                    />

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p style={{marginTop: '15px'}}>
                    Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

// Styles (No changes needed here, just standard CSS)
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
    card: { padding: '30px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', textAlign: 'center', width: '350px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
    input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' },
    button: { padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
    error: { color: 'red', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '5px' },
    link: { color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }
};

export default Register;