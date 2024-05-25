import { createSlice } from "@reduxjs/toolkit"

const setupSlice = createSlice({
    name: "agents",
    initialState: {
        agents: [],
        typeOfWork: [],
        profileOfClient: []
    },
    reducers: {
        getAgents(state, action){
            state.agents = action.payload
        },
        getTypeOfWork(state, action){
            state.typeOfWork = action.payload
        },
        getProfileOfClient(state, action){
            state.profileOfClient = action.payload
        }
    }
});

export const { getAgents, getTypeOfWork, getProfileOfClient } = setupSlice.actions;
export const setupReducer = setupSlice.reducer;