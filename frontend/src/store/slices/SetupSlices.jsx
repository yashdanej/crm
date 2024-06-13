import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "../../utils/Utils";

export const fetchCustomFields = createAsyncThunk('fetchCustomFields', async (table) => {
    try {
        console.log("table", table);
        const query = !table?"/util/get_custom_fields":`/util/get_custom_fields/${true}/${table}`
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
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const addCustomField = createAsyncThunk('addCustomField', async (data) => {
    try {
        const res = await api("/util/custom_field", "patch", data, false, true);
        return res.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const changeActiveStatus = createAsyncThunk("changeActiveStatus", async (id) => {
    try {
        const res = await api(`/util/change_custom_field_active/${id}`, "patch", false, false, true);
        return {...res.data, id};
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const deleteCustomField = createAsyncThunk("deleteCustomField", async (id) => {
    try {
        const res = await api(`/util//delete_custom_field/${id}`, "delete", false, false, true);
        return {id}
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const getCustomField = createAsyncThunk("getCustomField", async (id) => {
    try {
        const res = await api(`/util/get_custom_field/${id}`, "get", false, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const updateCustomField = createAsyncThunk('updateCustomField', async (data) => {
    console.log("id, data", data);
    try {
        const res = await api(`/util/update_custom_field/${data.id}`, "patch", data.data, false, true);
        return res.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const getLeadCustomField = createAsyncThunk('getLeadCustomField', async (id) => {
    try {
        const res = await api(`/lead/custom_field/${id}`, "get", false, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const getEmployee = createAsyncThunk('getEmployee', async () => {
    try {
        const res = await api(`/employee`, "get", false, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const addEmployee = createAsyncThunk('addEmployee', async (data) => {
    try {
        const res = await api(`/employee`, "post", data, true, true);
        return res.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const getRoles = createAsyncThunk('getRoles', async () => {
    try {
        const res = await api(`/util/roles`, "get", false, false, true);
        return res.data.data;
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
            },
            field: {
                isLoading: false,
                data: null,
                isError: false
            }
        },
        employees: {
            isLoading: false,
            data: [],
            isError: false,
        },
        roles: {
            isLoading: false,
            data: [],
            isError: false,
        }
    },
    extraReducers: (builder) => {
        // getEmployee
        builder.addCase(getEmployee.pending, (state, action) => {
            state.employees.isLoading = true;
        });
        builder.addCase(getEmployee.fulfilled, (state, action) => {
            state.employees.isLoading = false;
            state.employees.data = action.payload;
        });
        builder.addCase(getEmployee.rejected, (state, action) => {
            console.log("error in getEmployee", action.payload);
            state.employees.isLoading = false;
            state.employees.isError = true;
        });

        // addEmployee
        builder.addCase(addEmployee.pending, (state, action) => {
            state.employees.isLoading = true;
        });
        builder.addCase(addEmployee.fulfilled, (state, action) => {
            state.employees.isLoading = false;
            state.employees.data.push(action.payload[0]);
        });
        builder.addCase(addEmployee.rejected, (state, action) => {
            console.log("error in addEmployee", action.payload);
            state.employees.isLoading = false;
            state.employees.isError = true;
        });

        // roles
        builder.addCase(getRoles.pending, (state, action) => {
            state.roles.isLoading = true;
        });
        builder.addCase(getRoles.fulfilled, (state, action) => {
            state.roles.isLoading = false;
            state.roles.data = action.payload;
        });
        builder.addCase(getRoles.rejected, (state, action) => {
            console.log("error in getRoles", action.payload);
            state.roles.isLoading = false;
            state.roles.isError = true;
        });

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

        // change active status
        builder.addCase(changeActiveStatus.pending, (state, action) => {
            state.customFields.isLoading = true;
        });
        builder.addCase(changeActiveStatus.fulfilled, (state, action) => {
            state.customFields.isLoading = false;
            const field = state.customFields.data.find(field => field.id === action.payload.id);
            if(field){
                field.active = action.payload.active;
            }
        });
        builder.addCase(changeActiveStatus.rejected, (state, action) => {
            console.log("error in changeActiveStatus", action.payload);
            state.customFields.isLoading = false;
            state.customFields.isError = true;
        });

        // delete custom field
        builder.addCase(deleteCustomField.pending, (state, action) => {
            state.customFields.isLoading = true;
        });
        builder.addCase(deleteCustomField.fulfilled, (state, action) => {
            state.customFields.isLoading = false;
            state.customFields.data = state.customFields.data.filter(field => field.id !== action.payload.id);
        });
        builder.addCase(deleteCustomField.rejected, (state, action) => {
            console.log("error in deleteCustomField", action.payload);
            state.customFields.isLoading = false;
            state.customFields.isError = true;
        });

         // get custom field
        builder.addCase(getCustomField.pending, (state, action) => {
            state.customFields.field.isLoading = true;
        });
        builder.addCase(getCustomField.fulfilled, (state, action) => {
            state.customFields.field.isLoading = false;
            state.customFields.field.data = action.payload;
        });
        builder.addCase(getCustomField.rejected, (state, action) => {
            console.log("error in getCustomField", action.payload);
            state.customFields.field.isLoading = false;
            state.customFields.field.isError = true;
        });

        // updateCustomField
        builder.addCase(updateCustomField.pending, (state, action) => {
            state.customFields.add.isLoading = true;
        });
        builder.addCase(updateCustomField.fulfilled, (state, action) => {
            state.customFields.add.isLoading = false;
            state.customFields.add.success = action.payload.success;
            state.customFields.add.message = action.payload.message;
        });
        builder.addCase(updateCustomField.rejected, (state, action) => {
            console.log("error in updateCustomField", action.payload);
            state.customFields.add.isLoading = false;
            state.customFields.add.isError = true;
        });

        // getLeadCustomField
        builder.addCase(getLeadCustomField.pending, (state, action) => {
            state.customFields.field.isLoading = true;
        });
        builder.addCase(getLeadCustomField.fulfilled, (state, action) => {
            state.customFields.field.isLoading = false;
            state.customFields.field.data = action.payload;
        });
        builder.addCase(getLeadCustomField.rejected, (state, action) => {
            console.log("error in getLeadCustomField", action.payload);
            state.customFields.field.isLoading = false;
            state.customFields.field.isError = true;
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
        resetCustomField(state, action){
            state.customFields.field.data = null
        }
    }
});

export const { getAgents, getTypeOfWork, getProfileOfClient, resetCustomField } = setupSlice.actions;
export const setupReducer = setupSlice.reducer;