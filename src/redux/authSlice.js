import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 1. Thunk asynchrone pour la connexion (Login)
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
        const response = await fetch('http://localhost:3001/api/v1/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return rejectWithValue(data.message || 'Erreur lors de la connexion');
        }

        // Retourne le body qui contient le token
        return data.body; 
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);

// 2. Thunk asynchrone pour récupérer le profil (GET)
export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async (token, { rejectWithValue }) => {
        try {
        const response = await fetch('http://localhost:3001/api/v1/user/profile', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return rejectWithValue(data.message || 'Erreur lors de la récupération du profil');
        }

        return data.body;
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);

// 3. Thunk asynchrone pour mettre à jour le profil (PUT)
export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async ({ userName, token }, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:3001/api/v1/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ userName }),
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || 'Erreur lors de la mise à jour du profil');
            }

            return data.body; // Retourne le profil mis à jour
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        user: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        logout: (state) => {
        state.token = null;
        state.user = null;
        state.status = 'idle';
        state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
        // Gestion du Login
        .addCase(loginUser.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.token = action.payload.token; 
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        })
        // Gestion du Profil
        .addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.user = action.payload; // stocke les infos utilisateur (firstName, lastName, etc.)
        })
        // Gestion de la mise à jour du profil
        .addCase(updateUserProfile.fulfilled, (state, action) => {
            console.log("PAYLOAD REÇU DU PUT :", action.payload); // <-- Ajoute ceci
            state.user = action.payload; // Met à jour avec le nouveau prénom / nom
        });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;