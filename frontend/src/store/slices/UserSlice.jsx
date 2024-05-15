import { createSlice } from "@reduxjs/toolkit";

const getUser = localStorage.getItem("user");
console.log('getUser', getUser);

const userSlice = createSlice({
    name: "user",
    initialState: {isLoggedIn: getUser?true:false},
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
export const { login, logout } = userSlice.actions;