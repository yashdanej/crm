import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        id: 7,
        email: "",
        full_name: ""
    },
    reducers: {
        login(state, action){
            console.log('state', state, 'action', action);
            const { id, email, full_name } = action.payload;
            return {
                ...state,
                id,
                email,
                full_name
            };
        },
        signup(state, action){}
    }
})

export default userSlice.reducer;
export const { login } = userSlice.actions;