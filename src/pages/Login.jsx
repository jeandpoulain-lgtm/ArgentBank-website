import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, fetchUserProfile } from '../redux/authSlice';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        // 1. Déclenchement de l'action asynchrone loginUser
        const resultAction = await dispatch(loginUser({ email, password }));

        // 2. Vérification du succès du Thunk
        if (loginUser.fulfilled.match(resultAction)) {
        const token = resultAction.payload.token;
        
        // 3. Optionnel mais conseillé : charger le profil tout de suite après l'authentification
        await dispatch(fetchUserProfile(token));

        // 4. Redirection vers la page profil
        navigate('/user');
        } else {
        // Si échec, on récupère le message d'erreur renvoyé par rejectWithValue
        setErrorMessage(resultAction.payload || 'Identifiants invalides');
        }
    };

    return (
        <main className="main bg-dark">
        <section className="sign-in-content">
            <i className="fa fa-user-circle sign-in-icon"></i>
            <h1>Sign In</h1>
            
            <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
                <label htmlFor="username">Username</label>
                <input
                type="text"
                id="username"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>

            <div className="input-wrapper">
                <label htmlFor="password">Password</label>
                <input
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
            </div>

            <div className="input-remember">
                <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me">Remember me</label>
            </div>

            {errorMessage && <p className="error-message" style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{errorMessage}</p>}

            <button type="submit" className="sign-in-button" disabled={status === 'loading'}>
                {status === 'loading' ? 'Connexion en cours...' : 'Sign In'}
            </button>
            </form>
        </section>
        </main>
    );
}

export default Login;