import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {isLoggedIn: false},
    reducers: {
        login(state){
            console.log('state', state);
            state.isLoggedIn = true;
        },
        logout(state){
            state.isLoggedIn = false;
        }
    }
})

export default userSlice.reducer;
export const { login } = userSlice.actions;