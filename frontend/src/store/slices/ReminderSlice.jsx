import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
const { api } = require("../../utils/Utils");

export const addReminder = createAsyncThunk("addReminder", async (data) => {
    try {
        const res = await api(`/reminder/addreminder/${data.id}`, "post", data.data, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const fetchReminder = createAsyncThunk("fetchReminder", async (data) => {
    try {
        const res = await api(`/reminder/${data.id}/${data.rel_type}`, "get", false, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

const reminderSlice = createSlice({
    name: "reminder",
    initialState: {
        lead: {
            isLoading: false,
            data: [],
            isError: false,
        }
    },
    extraReducers: (builder) => {
        // add note
        builder.addCase(addReminder.pending, (state, action) => {
            state.lead.isLoading = true;
        });
        builder.addCase(addReminder.fulfilled, (state, action) => {
            console.log("addCase-->action.payload------", action.payload[0]);
            state.lead.data.push(action.payload[0]);
            state.lead.isLoading = false;
        });
        builder.addCase(addReminder.rejected, (state, action) => {
            console.log("error in addReminder", action.payload);
            state.lead.isLoading = false;
            state.lead.isError = true;
        });

         // get notes
        builder.addCase(fetchReminder.pending, (state, action) => {
            state.lead.isLoading = true;
        });
        builder.addCase(fetchReminder.fulfilled, (state, action) => {
            state.lead.data = action.payload;
            state.lead.isLoading = false;
        });
        builder.addCase(fetchReminder.rejected, (state, action) => {
            console.log("error in fetchReminder", action.payload);
            state.lead.isLoading = false;
            state.lead.isError = true;
        });
    }
})

export const reminderReducer = reminderSlice.reducer;