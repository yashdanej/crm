import { createSlice } from "@reduxjs/toolkit";

const devSlice = createSlice({
    name: "dev",
    initialState: {
        company: [],
        superadmin: []
    },
    reducers: {
        fetchCompany(state, action){
            state.company = action.payload;
        },
        fetchSuperAdmins(state, action){
            state.superadmin = action.payload;
        }
    }
})

export default devSlice.reducer;
export const { fetchCompany, fetchSuperAdmins } = devSlice.actions;