import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile, updateUserProfile } from '../redux/authSlice';

function User() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.token);
    const user = useSelector((state) => state.auth.user);

    // État local unique pour le pseudo (userName)
    const [isEditing, setIsEditing] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        if (!user) {
            dispatch(fetchUserProfile(token));
        } else {
            // Initialise avec le userName actuel
            setUserName(user.userName || '');
        }
    }, [token, user, dispatch, navigate]);

    const handleSave = (e) => {
        e.preventDefault();
        // On envoie bien userName ici
        dispatch(updateUserProfile({ userName, token }));
        setIsEditing(false);
    };

    const handleCancel = () => {
        setUserName(user.userName || '');
        setIsEditing(false);
    };

    return (
        <main className="main bg-dark">
            <div className="header">
                <h1>
                    Welcome back
                    <br />
                    {!isEditing && (user ? `${user.firstName} ${user.lastName} (${user.userName})!` : 'Loading...')}
                </h1>

                {!isEditing ? (
                    <button className="edit-button" onClick={() => setIsEditing(true)}>
                        Edit Name
                    </button>
                ) : (
                    <form onSubmit={handleSave} className="edit-name-form">
                        <div className="edit-inputs-container">
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="User Name"
                                required
                                className="edit-input"
                            />
                            {/* Les champs Prénom et Nom d'état civil ne sont pas modifiables via l'API, on les désactive ou retire */}
                            <input
                                type="text"
                                value={user ? user.firstName : ''}
                                disabled
                                className="edit-input bg-disabled"
                            />
                            <input
                                type="text"
                                value={user ? user.lastName : ''}
                                disabled
                                className="edit-input bg-disabled"
                            />
                        </div>
                        <div className="edit-buttons-container">
                            <button type="submit" className="edit-name-button">
                                Save
                            </button>
                            <button type="button" onClick={handleCancel} className="cancel-name-button">
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
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
                    <h3 className="account-title">Argent Bank Credit Card (x8343)</h3>
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