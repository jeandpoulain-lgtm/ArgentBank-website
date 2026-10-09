import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserProfile } from '../redux/authSlice';

function User() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Récupération du token et de l'utilisateur depuis Redux
    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        // Si pas de token, redirection vers la page de connexion
        if (!token) {
        navigate('/login');
        return;
        }

        const fetchUserProfile = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/v1/user/profile', {
            method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            // 1. On vérifie si la réponse HTTP est un succès (status 200)
            if (response.ok) {
                const data = await response.json();
                console.log('Données profil reçues :', data);
                dispatch(setUserProfile(data.body));
            } else {
                // Si le serveur renvoie 404, 401, etc., on l'affiche proprement sans tenter d'analyser du HTML en JSON
                console.error(`Erreur HTTP : ${response.status} (${response.statusText})`);
            }
        } catch (error) {
            console.error('Erreur réseau :', error);
        }
        };

        fetchUserProfile();
    }, [token, dispatch, navigate]);

    return (
        <main className="main bg-dark">
        <div className="header">
            <h1>
            Welcome back
            <br />
            {user ? `${user.firstName} ${user.lastName}!` : 'Loading...'}
            </h1>
            <button className="edit-button">Edit Name</button>
        </div>

        <h2 className="sr-only">Accounts</h2>

        <section className="account">
            <div className="account-content-wrapper">
                <h3 className="account-title">Argent Bank Checking (x8349)</h3>
                <p className="account-amount">$2,082.79</p>
                <p className="account-amount-description">Available Balance</p>
            </div>
            <div className="account-content-wrapper cta">
                <button className="transaction-button">View transactions</button>
            </div>
        </section>

        <section className="account">
            <div className="account-content-wrapper">
                <h3 className="account-title">Argent Bank Savings (x6712)</h3>
                <p className="account-amount">$10,928.42</p>
                <p className="account-amount-description">Available Balance</p>
            </div>
            <div className="account-content-wrapper cta">
                <button className="transaction-button">View transactions</button>
            </div>
        </section>

        <section className="account">
            <div className="account-content-wrapper">
                <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
                <p className="account-amount">$184.30</p>
                <p className="account-amount-description">Current Balance</p>
            </div>
            <div className="account-content-wrapper cta">
                <button className="transaction-button">View transactions</button>
            </div>
        </section>
        </main>
    );
}

export default User;