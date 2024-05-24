import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notification: [],
        socket: null
    },
    reducers: {
        getUserNotification(state, action){
            state.notification = action.payload;
        },
        setupSocket(state, action){
            state.socket = action.payload
        }
    }
});

export const { getUserNotification, setupSocket } = notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;