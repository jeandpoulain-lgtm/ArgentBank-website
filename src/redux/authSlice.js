import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    user: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        //liste des action (dans le cour reduction, total)
            // Action appelée quand la connexion réussit (on sauvegarde le token)
            setLogin: (state, action) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
            // Action appelée quand on récupère les infos du profil (nom, prénom)
            setUserProfile: (state, action) => {
            state.user = action.payload;
        },
            // Action appelée quand on modifie le prénom/nom
            updateUsername: (state, action) => {
            if (state.user) {
                state.user.firstName = action.payload.firstName;
                state.user.lastName = action.payload.lastName;
            }
        },
        // Action appelée quand l'utilisateur se déconnecte 
        setLogout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setLogin, setUserProfile, updateUsername, setLogout } = authSlice.actions;
export default authSlice.reducer;