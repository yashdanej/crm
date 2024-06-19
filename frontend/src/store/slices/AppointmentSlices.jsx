import { api } from "../../utils/Utils";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const addAppointment = createAsyncThunk('addAppointment', async (data, { rejectWithValue }) => {
    try {
        console.log("data---------", data);
        const res = await api(`/appoinment`, "post", data, false, true);
        console.log("res.data---", res);
        // Check if the API response indicates failure
        if (!res.data.success) {
            return rejectWithValue(res.data.message); // Reject with the error message
        }
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        return rejectWithValue(err.message); // Reject with the error message
    }
});

export const fetchAppointments = createAsyncThunk("fetchAppointments", async (id) => {
    try {
        const res = await api(`/appoinment`, "get", false, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const getAppoinmentById = createAsyncThunk('getAppoinmentById', async (id) => {
    try {
        const res = await api(`/appoinment/${id}`, "get", false, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const updateAppoinment = createAsyncThunk('updateAppoinment', async (data, { rejectWithValue }) => {
    console.log("id, data", data);
    try {
        const res = await api(`/appoinment/${data.id}`, "patch", data.data, false, true);
        // Check if the API response indicates failure
        if (!res.data.success) {
            return rejectWithValue(res.data.message); // Reject with the error message
        }
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        return rejectWithValue(err.message); // Reject with the error message
    }
});

export const completeAppoinment = createAsyncThunk('completeAppoinment', async (id, { rejectWithValue }) => {
    try {
        const res = await api(`/appoinment/complete/${id}`, "patch", false, false, true);
        // Check if the API response indicates failure
        if (!res.data.success) {
            return rejectWithValue(res.data.message); // Reject with the error message
        }
        return {id};
    } catch (err) {
        console.log("err", err);
        return rejectWithValue(err.message); // Reject with the error message
    }
});

export const deleteAppoinment = createAsyncThunk('deleteAppoinment', async (id, { rejectWithValue }) => {
    try {
        const res = await api(`/appoinment/${id}`, "delete", false, false, true);
        // Check if the API response indicates failure
        if (!res.data.success) {
            return rejectWithValue(res.data.message); // Reject with the error message
        }
        return {id};
    } catch (err) {
        console.log("err", err);
        return rejectWithValue(err.message); // Reject with the error message
    }
});


const appointmentSlice = createSlice({
    name: "appointment",
    initialState: {
        appointment: {
            isLoading: false,
            data: [],
            isError: false,
            edit: {
                isLoading: false,
                data: [],
                isError: false,
            }
        }
    },
    extraReducers: (builder) => {
        // add attachment
        builder.addCase(addAppointment.pending, (state, action) => {
            state.appointment.isLoading = true;
        });
        builder.addCase(addAppointment.fulfilled, (state, action) => {
            console.log("addCase-->action.payload------", action.payload[0]);
            state.appointment.data.push(action.payload[0]);
            state.appointment.isLoading = false;
        });
        builder.addCase(addAppointment.rejected, (state, action) => {
            console.log("error in addAttachment", action.payload);
            state.appointment.isLoading = false;
            state.appointment.isError = true;
        });

         // get attachments
        builder.addCase(fetchAppointments.pending, (state, action) => {
            state.appointment.isLoading = true;
        });
        builder.addCase(fetchAppointments.fulfilled, (state, action) => {
            state.appointment.data = action.payload;
            state.appointment.isLoading = false;
        });
        builder.addCase(fetchAppointments.rejected, (state, action) => {
            console.log("error in fetchAppointments", action.payload);
            state.appointment.isLoading = false;
            state.appointment.isError = true;
        });

         // getAppoinmentById
        builder.addCase(getAppoinmentById.pending, (state, action) => {
            state.appointment.edit.isLoading = true;
        });
        builder.addCase(getAppoinmentById.fulfilled, (state, action) => {
            state.appointment.edit.isLoading = false;
            state.appointment.edit.id = action.payload[0].id;
            state.appointment.edit.data = action.payload;
        });
        builder.addCase(getAppoinmentById.rejected, (state, action) => {
            console.log("error in getAppoinmentById", action.payload);
            state.appointment.edit.isLoading = false;
            state.appointment.edit.isError = true;
        });

        // updateAppoinment
        builder.addCase(updateAppoinment.pending, (state, action) => {
            state.appointment.edit.isLoading = true;
        });
        builder.addCase(updateAppoinment.fulfilled, (state, action) => {
            state.appointment.edit.isLoading = false;
            state.appointment.edit.data = [];
            console.log("action.payload", action.payload);
            state.appointment.data.filter(data => data.id !== action.payload[0].id);
            state.appointment.data.push(action.payload[0]);
        });
        builder.addCase(updateAppoinment.rejected, (state, action) => {
            console.log("error in updateAppoinment", action.payload);
            state.appointment.edit.isLoading = false;
            state.appointment.edit.isError = true;
        });
        
        // completeAppoinment
        builder.addCase(completeAppoinment.pending, (state, action) => {
            state.appointment.isLoading = true;
        });
        builder.addCase(completeAppoinment.fulfilled, (state, action) => {
            state.appointment.isLoading = false;
            console.log("action.payload", action.payload);
            state.appointment.edit.isLoading = false;
            state.appointment.edit.data = [];
            state.appointment.data = state.appointment.data.filter(appointment => appointment.id !== action.payload.id);
        });
        builder.addCase(completeAppoinment.rejected, (state, action) => {
            console.log("error in completeAppoinment", action.payload);
            state.appointment.isLoading = false;
            state.appointment.isError = true;
        });

        // deleteAppoinment
        builder.addCase(deleteAppoinment.pending, (state, action) => {
            state.appointment.isLoading = true;
        });
        builder.addCase(deleteAppoinment.fulfilled, (state, action) => {
            state.appointment.isLoading = false;
            console.log("action.payload", action.payload);
            state.appointment.edit.isLoading = false;
            state.appointment.edit.data = [];
            state.appointment.data = state.appointment.data.filter(appointment => appointment.id !== action.payload.id);
        });
        builder.addCase(deleteAppoinment.rejected, (state, action) => {
            console.log("error in deleteAppoinment", action.payload);
            state.appointment.isLoading = false;
            state.appointment.isError = true;
        });
    }
})

export const appointmentReducer = appointmentSlice.reducer;