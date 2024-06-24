import { api } from "../../utils/Utils";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const addAttachment = createAsyncThunk("addAttachment", async (data) => {
    try {
        const res = await api(`/attachment/add_attachment/${data.id}`, "post", data.data, true, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const fetchAttachments = createAsyncThunk("fetchAttachments", async (data) => {
    try {
        console.log("data in fetchAttachments", data);
        const res = await api(`/attachment/${data.id}/${data.rel_type}`, "get", false, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

const attachmentSlice = createSlice({
    name: "attachment",
    initialState: {
        lead: {
            isLoading: false,
            data: [],
            isError: false,
        }
    },
    extraReducers: (builder) => {
        // add attachment
        builder.addCase(addAttachment.pending, (state, action) => {
            state.lead.isLoading = true;
        });
        builder.addCase(addAttachment.fulfilled, (state, action) => {
            console.log("addCase-->action.payload------", action.payload[0]);
            state.lead.data.push(action.payload[0]);
            state.lead.isLoading = false;
        });
        builder.addCase(addAttachment.rejected, (state, action) => {
            console.log("error in addAttachment", action.payload);
            state.lead.isLoading = false;
            state.lead.isError = true;
        });

         // get attachments
        builder.addCase(fetchAttachments.pending, (state, action) => {
            state.lead.isLoading = true;
        });
        builder.addCase(fetchAttachments.fulfilled, (state, action) => {
            state.lead.data = action.payload;
            state.lead.isLoading = false;
        });
        builder.addCase(fetchAttachments.rejected, (state, action) => {
            console.log("error in fetchAttachments", action.payload);
            state.lead.isLoading = false;
            state.lead.isError = true;
        });
    }
})

export const attachmentReducer = attachmentSlice.reducer;