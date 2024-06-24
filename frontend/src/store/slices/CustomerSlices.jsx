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

export const addContact = createAsyncThunk('addContact', async (data, { rejectWithValue }) => {
    try {
        console.log("data---------", data);
        const res = await api(`/contact`, "post", data, true, true);
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

export const deleteContact = createAsyncThunk("deleteContact", async (id) => {
    try {
        const res = await api(`/contact/${id}`, "delete", false, false, true);
        return {id}
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const getContactById = createAsyncThunk('getContactById', async (id) => {
    try {
        const res = await api(`/contact/contact_by_id/${id}`, "get", false, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const updateContact = createAsyncThunk('updateContact', async (data, { rejectWithValue }) => {
    console.log("id, data", data);
    try {
        const res = await api(`/contact/${data.id}`, "patch", data.data, true, true);
        // Check if the API response indicates failure
        if (!res.data.success) {
            return rejectWithValue(res.data.message); // Reject with the error message
        }
        return res.data;
    } catch (err) {
        console.log("err in updateContact", err);
        return rejectWithValue(err.message); // Reject with the error message
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
        
        // addContact
        builder.addCase(addContact.pending, (state, action) => {
            state.contacts.isLoading = true;
        });
        builder.addCase(addContact.fulfilled, (state, action) => {
            console.log("action.payload----------", action.payload);
            state.contacts.isLoading = false;
            if(action.payload.success){
                console.log("in-*-");
                state.contacts.data.push(action.payload.data[0]);
                state.contacts.success = true;
                state.contacts.message = action.payload.message;
            }else{
                console.log("out-*-");
                state.contacts.success = false;
                state.contacts.message = action.payload.message;
            }
        });
        builder.addCase(addContact.rejected, (state, action) => {
            console.log("error in addContact", action.payload);
            state.contacts.isLoading = false;
            state.contacts.isError = true;
            state.contacts.message = action.payload;
        });

        // deleteContact
        builder.addCase(deleteContact.pending, (state, action) => {
            state.contacts.isLoading = true;
        });
        builder.addCase(deleteContact.fulfilled, (state, action) => {
            console.log("action.payload deleteContact", action.payload);
            state.contacts.isLoading = false;
            state.contacts.success = true;
            state.contacts.isError = false;
            state.contacts.data = state.contacts.data.filter(field => field.id !== action.payload.id);
        });
        builder.addCase(deleteContact.rejected, (state, action) => {
            console.log("error in deleteContact", action.payload);
            console.log("action.payload deleteContact", action.payload);
            state.contacts.isLoading = false;
            state.contacts.isError = true;
            state.contacts.message = action.payload;
        });

        // getContactById
        builder.addCase(getContactById.pending, (state, action) => {
            state.contacts.edit.isLoading = true;
        });
        builder.addCase(getContactById.fulfilled, (state, action) => {
            state.contacts.edit.isLoading = false;
            state.contacts.edit.id = action.payload[0].id;
            state.contacts.edit.data = action.payload;
        });
        builder.addCase(getContactById.rejected, (state, action) => {
            console.log("error in getContactById", action.payload);
            state.contacts.edit.isLoading = false;
            state.contacts.edit.isError = true;
        });

        // updateContact
        builder.addCase(updateContact.pending, (state, action) => {
            state.contacts.edit.isLoading = true;
        });
        builder.addCase(updateContact.fulfilled, (state, action) => {
            state.contacts.edit.isLoading = false;
            state.contacts.edit.data = [];
            state.contacts.edit.id = null;
            state.contacts.edit.success = true;
            state.contacts.edit.message = action.payload.message;
        });
        builder.addCase(updateContact.rejected, (state, action) => {
            console.log("error in updateContact", action.payload);
            state.contacts.edit.isLoading = false;
            state.contacts.edit.isError = true;
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
        },
        emptyContactEdit(state, action){
            state.contacts.edit.id = null;
            state.contacts.edit.isLoading = false;
            state.contacts.edit.data = [];
            state.contacts.edit.isError = false;
            state.contacts.edit.success = false;
            state.contacts.edit.message = "";
        }
    }
})

export const { resetCustomer, addContactId, emptyContactId, emptyContactEdit } = customerSlice.actions;
export const customerReducer = customerSlice.reducer;