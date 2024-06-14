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
        console.log("data---------", data);
        const res = await api(`/employee`, "post", data, true, true);
        console.log("res.data---" , res);
        return res.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const addEmployeeDetail = createAsyncThunk('addEmployeeDetail', async (data) => {
    try {
        console.log("data---------", data);
        const res = await api(`/employee/emp_detail/${data.id}`, "post", data.data, false, true);
        console.log("res.data---" , res);
        return res.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const deleteEmployee = createAsyncThunk("deleteEmployee", async (id) => {
    try {
        const res = await api(`/employee/${id}`, "delete", false, false, true);
        return {id}
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const getEmployeeField = createAsyncThunk('getEmployeeField', async (id) => {
    try {
        const res = await api(`/employee/${id}`, "get", false, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const getEmployeeDetails = createAsyncThunk('getEmployeeDetails', async (id) => {
    try {
        const res = await api(`/employee/detail/${id}`, "get", false, false, true);
        console.log("res.data.data detilas", res);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const updateEmployee = createAsyncThunk('updateEmployee', async (data) => {
    console.log("id, data", data);
    try {
        const res = await api(`/employee/${data.id}`, "patch", data.data, true, true);
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
            success: false,
            message: "",
            details: {
                id: null,
                isLoading: false,
                data: [],
                isError: false,
                success: false,
                message: ""
            },
            edit: {
                id: null,
                isLoading: false,
                data: [],
                isError: false,
                success: false,
                message: "",
            }
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
            console.log("action.payload----------", action.payload);
            state.employees.isLoading = false;
            if(action.payload.success){
                state.employees.data.push(action.payload.data[0]);
                state.employees.success = true;
                state.employees.details.id = action.payload.data[0].id;
                state.employees.message = action.payload.message;
            }else{
                state.employees.success = false;
                state.employees.message = action.payload.message;
            }
        });
        builder.addCase(addEmployee.rejected, (state, action) => {
            console.log("error in addEmployee", action.payload);
            state.employees.isLoading = false;
            state.employees.isError = true;
        });

         // delete employee
        builder.addCase(deleteEmployee.pending, (state, action) => {
            state.employees.isLoading = true;
        });
        builder.addCase(deleteEmployee.fulfilled, (state, action) => {
            state.employees.isLoading = false;
            state.employees.data = state.employees.data.filter(field => field.id !== action.payload.id);
        });
        builder.addCase(deleteEmployee.rejected, (state, action) => {
            console.log("error in deleteCustomField", action.payload);
            state.employees.isLoading = false;
            state.employees.isError = true;
        });

        // getEmployeeField
        builder.addCase(getEmployeeField.pending, (state, action) => {
            state.employees.details.isLoading = true;
        });
        builder.addCase(getEmployeeField.fulfilled, (state, action) => {
            state.employees.details.isLoading = false;
            state.employees.details.id = action.payload[0].id;
            state.employees.details.data = action.payload;
        });
        builder.addCase(getEmployeeField.rejected, (state, action) => {
            console.log("error in getLeadCustomField", action.payload);
            state.employees.details.isLoading = false;
            state.employees.details.isError = true;
        });

        // updateEmployee
        builder.addCase(updateEmployee.pending, (state, action) => {
            state.employees.details.isLoading = true;
        });
        builder.addCase(updateEmployee.fulfilled, (state, action) => {
            state.employees.details.isLoading = false;
            state.employees.details.success = true;
            state.employees.details.message = action.payload.message;
        });
        builder.addCase(updateEmployee.rejected, (state, action) => {
            console.log("error in updateEmployee", action.payload);
            state.employees.details.isLoading = false;
            state.employees.details.isError = true;
        });

        // addEmployeeDetails
        builder.addCase(addEmployeeDetail.pending, (state, action) => {
            state.employees.details.isLoading = true;
        });
        builder.addCase(addEmployeeDetail.fulfilled, (state, action) => {
            console.log("action.payload----------", action.payload);
            state.employees.details.isLoading = false;
            if(action.payload.success){
                state.employees.details.success = true;
                state.employees.details.message = action.payload.message;
            }else{
                state.employees.details.success = false;
                state.employees.details.message = action.payload.message;
            }
        });
        builder.addCase(addEmployeeDetail.rejected, (state, action) => {
            console.log("error in addEmployee", action.payload);
            state.employees.details.isLoading = false;
            state.employees.details.isError = true;
        });

        // getEmployeeDetails
        builder.addCase(getEmployeeDetails.pending, (state, action) => {
            state.employees.edit.isLoading = true;
        });
        builder.addCase(getEmployeeDetails.fulfilled, (state, action) => {
            console.log("action.pyalcasd getEmployeeDetails", action.payload);
            state.employees.edit.isLoading = false;
            state.employees.edit.id = action.payload[0].id;
            state.employees.edit.data = action.payload;
        });
        builder.addCase(getEmployeeDetails.rejected, (state, action) => {
            console.log("error in getEmployeeDetails", action.payload);
            state.employees.edit.isLoading = false;
            state.employees.edit.isError = true;
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
        },
        resetEmployee(state, action){
            state.employees.message = ""
            state.employees.details.data = []
            state.employees.details.id = null
            state.employees.details.message = ""
            state.employees.edit.data = []
            state.employees.edit.id = null
            state.employees.edit.message = ""
        }
    }
});

export const { getAgents, getTypeOfWork, getProfileOfClient, resetCustomField, resetEmployee } = setupSlice.actions;
export const setupReducer = setupSlice.reducer;