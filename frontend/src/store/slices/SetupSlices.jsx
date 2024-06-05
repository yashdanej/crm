import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "../../utils/Utils";

export const fetchCustomFields = createAsyncThunk('fetchCustomFields', async (table) => {
    try {
        console.log("table", table);
        const query = !table?"/util/get_custom_fields":`/util/get_custom_fields/${table}`
        const res = await api(query, "get", false, false, true);
        console.log("getCustomFields", res.data.data);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const fetchTablesData = createAsyncThunk('fetchTablesData', async () => {
    try {
        const res = await api("/util/get_tables", "get", false, false, true);
        console.log("fetchTablesData", fetchTablesData);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const addCustomField = createAsyncThunk('addCustomField', async (data) => {
    try {
        const res = await api("/util/custom_field", "patch", data, false, true);
        console.log("fetchTablesData", fetchTablesData);
        return res.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

const setupSlice = createSlice({
    name: "agents",
    initialState: {
        agents: [],
        typeOfWork: [],
        profileOfClient: [],
        customFields: {
            isLoading: false,
            data: null,
            isError: false,
            tables: {
                isLoading: false,
                data: null,
                isError: false
            },
            add: {
                isLoading: false,
                success: false,
                message: null,
                isError: false
            }
        }
    },
    extraReducers: (builder) => {
        // fetchCustomFields
        builder.addCase(fetchCustomFields.pending, (state, action) => {
            state.customFields.isLoading = true;
        });
        builder.addCase(fetchCustomFields.fulfilled, (state, action) => {
            state.customFields.isLoading = false;
            state.customFields.data = action.payload;
        });
        builder.addCase(fetchCustomFields.rejected, (state, action) => {
            console.log("error in fetchCustomFields", action.payload);
            state.customFields.isLoading = false;
            state.customFields.isError = true;
        });

        // fetchTablesData
        builder.addCase(fetchTablesData.pending, (state, action) => {
            state.customFields.tables.isLoading = true;
        });
        builder.addCase(fetchTablesData.fulfilled, (state, action) => {
            state.customFields.tables.isLoading = false;
            state.customFields.tables.data = action.payload;
        });
        builder.addCase(fetchTablesData.rejected, (state, action) => {
            console.log("error in fetchCustomFields", action.payload);
            state.customFields.tables.isLoading = false;
            state.customFields.tables.isError = true;
        });

        // addCustomField
        builder.addCase(addCustomField.pending, (state, action) => {
            state.customFields.add.isLoading = true;
        });
        builder.addCase(addCustomField.fulfilled, (state, action) => {
            state.customFields.add.isLoading = false;
            state.customFields.add.success = action.payload.success;
            state.customFields.add.message = action.payload.message;
        });
        builder.addCase(addCustomField.rejected, (state, action) => {
            console.log("error in fetchCustomFields", action.payload);
            state.customFields.add.isLoading = false;
            state.customFields.add.isError = true;
        });
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
        },
    }
});

export const { getAgents, getTypeOfWork, getProfileOfClient, addToggleOpenInCustomField } = setupSlice.actions;
export const setupReducer = setupSlice.reducer;