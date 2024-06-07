import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
const { api } = require("../../utils/Utils");

export const addNote = createAsyncThunk("addNote", async (data) => {
    try {
        const res = await api(`/notes/addnote/${data.id}`, "post", data.data, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const fetchNotes = createAsyncThunk("fetchNotes", async (id) => {
    try {
        const res = await api(`/notes/${id}`, "get", false, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

const noteSlice = createSlice({
    name: "note",
    initialState: {
        lead: {
            isLoading: false,
            data: [],
            isError: false,
        }
    },
    extraReducers: (builder) => {
        // add note
        builder.addCase(addNote.pending, (state, action) => {
            state.lead.isLoading = true;
        });
        builder.addCase(addNote.fulfilled, (state, action) => {
            console.log("addCase-->action.payload------", action.payload[0]);
            state.lead.data.push(action.payload[0]);
            state.lead.isLoading = false;
        });
        builder.addCase(addNote.rejected, (state, action) => {
            console.log("error in addNote", action.payload);
            state.lead.isLoading = false;
            state.lead.isError = true;
        });

         // get notes
        builder.addCase(fetchNotes.pending, (state, action) => {
            state.lead.isLoading = true;
        });
        builder.addCase(fetchNotes.fulfilled, (state, action) => {
            state.lead.data = action.payload;
            state.lead.isLoading = false;
        });
        builder.addCase(fetchNotes.rejected, (state, action) => {
            console.log("error in fetchNotes", action.payload);
            state.lead.isLoading = false;
            state.lead.isError = true;
        });
    }
})

export const noteReducer = noteSlice.reducer;