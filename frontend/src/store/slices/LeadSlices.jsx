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
        kanbanView: false,
        leadsByStatus: [],
        leadIds: ""
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
        },
        kanbanLeads(state, action){
            state.leadsByStatus = action.payload
        },
        leadIdSelect(state, action){
            const id = action.payload;
            const currentIds = state.leadIds ? state.leadIds.split(",") : [];
            console.log('currentIds', currentIds);
        
            if (currentIds.includes(`${id}`)) {
                state.leadIds = currentIds.filter(currentId => currentId !== `${id}`).join(",");
                console.log('state.leadIds', state.leadIds);
            } else {
                currentIds.push(id);
                state.leadIds = currentIds.join(",");
                console.log('state.leadIds2', state.leadIds);
            }
        },
        leadIdDeselectAll(state, action){
            state.leadIds = ""
        }
    }
});


export const { getStatus } = statusSlice.actions;
export const { getSource } = sourceSlice.actions;
export const { getAssigned } = assignedSlice.actions;
export const { getCountries } = countriesSlice.actions;
export const { getAllLeads, getLead, kanbanViewFn, kanbanLeads, leadIdSelect, leadIdDeselectAll } = leadsSlice.actions;

export const statusReducer = statusSlice.reducer;
export const sourceReducer = sourceSlice.reducer;
export const assignedReducer = assignedSlice.reducer;
export const countriesReducer = countriesSlice.reducer;
export const leadsReducer = leadsSlice.reducer;
