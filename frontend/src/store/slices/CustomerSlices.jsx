import { api } from "../../utils/Utils";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getCustomer = createAsyncThunk('getCustomer', async () => {
    try {
        const res = await api(`/customer`, "get", false, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const addCustomer = createAsyncThunk('addCustomer', async (data, { rejectWithValue }) => {
    try {
        console.log("data---------", data);
        const res = await api(`/customer`, "post", data, false, true);
        console.log("res.data---", res);
        // Check if the API response indicates failure
        if (!res.data.success) {
            return rejectWithValue(res.data.message); // Reject with the error message
        }
        return res.data;
    } catch (err) {
        console.log("err", err);
        return rejectWithValue(err.message); // Reject with the error message
    }
});

export const deleteCustomer = createAsyncThunk("deleteCustomer", async (id) => {
    try {
        const res = await api(`/customer/${id}`, "delete", false, false, true);
        return {id}
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const getCustomerById = createAsyncThunk('getCustomerById', async (id) => {
    try {
        const res = await api(`/customer/${id}`, "get", false, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const updateCustomer = createAsyncThunk('updateCustomer', async (data, { rejectWithValue }) => {
    console.log("id, data", data);
    try {
        const res = await api(`/customer/${data.id}`, "patch", data.data, false, true);
        // Check if the API response indicates failure
        if (!res.data.success) {
            return rejectWithValue(res.data.message); // Reject with the error message
        }
        return res.data;
    } catch (err) {
        console.log("err", err);
        return rejectWithValue(err.message); // Reject with the error message
    }
});

// Contacts
export const getContact = createAsyncThunk('getContact', async (id) => {
    try {
        const res = await api(`/contact/${id}`, "get", false, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

const customerSlice = createSlice({
    name: "customer",
    initialState: {
        customers: {
            isLoading: false,
            data: [],
            isError: false,
            success: false,
            message: "",
            edit: {
                id: null,
                isLoading: false,
                data: [],
                isError: false,
                success: false,
                message: "",
            }
        },
        id: null,
        contacts: {
            isLoading: false,
            data: [],
            isError: false,
        }
    },
    extraReducers: (builder) => {
        // getCustomer
        builder.addCase(getCustomer.pending, (state, action) => {
            state.customers.isLoading = true;
        });
        builder.addCase(getCustomer.fulfilled, (state, action) => {
            state.customers.isLoading = false;
            state.customers.data = action.payload;
        });
        builder.addCase(getCustomer.rejected, (state, action) => {
            console.log("error in getCustomer", action.payload);
            state.customers.isLoading = false;
            state.customers.isError = true;
        }); 

        // addCustomer
        builder.addCase(addCustomer.pending, (state, action) => {
            state.customers.isLoading = true;
        });
        builder.addCase(addCustomer.fulfilled, (state, action) => {
            console.log("action.payload----------", action.payload);
            state.customers.isLoading = false;
            if(action.payload.success){
                state.customers.data.push(action.payload.data[0]);
                state.customers.success = true;
                state.customers.message = action.payload.message;
            }else{
                state.customers.success = false;
                state.customers.message = action.payload.message;
            }
        });
        builder.addCase(addCustomer.rejected, (state, action) => {
            console.log("error in addCustomer", action.payload);
            state.customers.isLoading = false;
            state.customers.isError = true;
        });

        // delete Customer
        builder.addCase(deleteCustomer.pending, (state, action) => {
            state.customers.isLoading = true;
        });
        builder.addCase(deleteCustomer.fulfilled, (state, action) => {
            state.customers.isLoading = false;
            state.customers.data = state.customers.data.filter(field => field.id !== action.payload.id);
        });
        builder.addCase(deleteCustomer.rejected, (state, action) => {
            console.log("error in deleteCustomer", action.payload);
            state.customers.isLoading = false;
            state.customers.isError = true;
        });

         // getCustomerById
         builder.addCase(getCustomerById.pending, (state, action) => {
            state.customers.edit.isLoading = true;
        });
        builder.addCase(getCustomerById.fulfilled, (state, action) => {
            state.customers.edit.isLoading = false;
            state.customers.edit.id = action.payload[0].id;
            state.customers.edit.data = action.payload;
        });
        builder.addCase(getCustomerById.rejected, (state, action) => {
            console.log("error in getCustomerById", action.payload);
            state.customers.edit.isLoading = false;
            state.customers.edit.isError = true;
        });

        // updateCustomer
        builder.addCase(updateCustomer.pending, (state, action) => {
            state.customers.edit.isLoading = true;
        });
        builder.addCase(updateCustomer.fulfilled, (state, action) => {
            state.customers.edit.isLoading = false;
            state.customers.edit.data = [];
            state.customers.edit.success = true;
            state.customers.edit.message = action.payload.message;
        });
        builder.addCase(updateCustomer.rejected, (state, action) => {
            console.log("error in updateCustomer", action.payload);
            state.customers.edit.isLoading = false;
            state.customers.edit.isError = true;
        });

        // getContacts
        builder.addCase(getContact.pending, (state, action) => {
            state.contacts.isLoading = true;
        });
        builder.addCase(getContact.fulfilled, (state, action) => {
            state.contacts.isLoading = false;
            state.contacts.data = action.payload;
        });
        builder.addCase(getContact.rejected, (state, action) => {
            console.log("error in getContact", action.payload);
            state.contacts.isLoading = false;
            state.contacts.isError = true;
        }); 
    },
    reducers: {
        resetCustomer(state, action){
            state.customers.message = ""
            state.customers.edit.id = null
            state.customers.edit.data = []
            state.customers.edit.message = ""
        },
        addContactId(state, action){
            state.id = action.payload
        },
        emptyContactId(state, action){
            state.id = null
        }
    }
})

export const { resetCustomer, addContactId, emptyContactId } = customerSlice.actions;
export const customerReducer = customerSlice.reducer;