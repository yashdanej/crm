import { createSlice } from "@reduxjs/toolkit";

// Slice for status actions and reducers
const statusSlice = createSlice({
    name: "status",
    initialState: {
        statusData: [],
    },
    reducers: {
        getStatus(state, action){
            console.log('state', state);
            console.log('action.payload', action.payload);
            state.statusData = action.payload;
        }
    }
});

// Slice for source actions and reducers
const sourceSlice = createSlice({
    name: "source",
    initialState: {
        sourceData: [],
    },
    reducers: {
        getSource(state, action){
            console.log('state', state);
            console.log('action.payload', action.payload);
            state.sourceData = action.payload;
        }
    }
});

// Slice for assigned actions and reducers
const assignedSlice = createSlice({
    name: "assigned",
    initialState: {
        assignedData: [],
    },
    reducers: {
        getAssigned(state, action){
            console.log('state', state);
            console.log('action.payload', action.payload);
            state.assignedData = action.payload;
        }
    }
});

const countriesSlice = createSlice({
    name: "countries",
    initialState: {
        countriesData: []
    },
    reducers: {
        getCountries(state, action){
            state.countriesData = action.payload;
        }
    }
});

const leadsSlice = createSlice({
    name: "leads",
    initialState: {
        leadsData: [],
        leadData: [],
        kanbanView: false
    },
    reducers: {
        getAllLeads(state, action){
            state.leadsData = action.payload
        },
        getLead(state, action){
            state.leadData = action.payload
        },
        kanbanViewFn(state, action){
            state.kanbanView = action.payload
        }
    }
});


export const { getStatus } = statusSlice.actions;
export const { getSource } = sourceSlice.actions;
export const { getAssigned } = assignedSlice.actions;
export const { getCountries } = countriesSlice.actions;
export const { getAllLeads, getLead, kanbanViewFn } = leadsSlice.actions;

export const statusReducer = statusSlice.reducer;
export const sourceReducer = sourceSlice.reducer;
export const assignedReducer = assignedSlice.reducer;
export const countriesReducer = countriesSlice.reducer;
export const leadsReducer = leadsSlice.reducer;
