import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
        },
        deleteUserSuccess: (state, action) => {
            state.currentUser = null;
        },
        signOutUserSuccess: (state, action) => {
            state.currentUser = null;
        },
    },
});

export const {
    signInSuccess,
    updateUserSuccess,
    deleteUserSuccess,
    signOutUserSuccess,
} = userSlice.actions;

export default userSlice.reducer;