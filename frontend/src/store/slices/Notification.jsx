import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notification: [],
        socket: null
    },
    reducers: {
        getUserNotification(state, action){
            console.log("...state, action.payload", state.notification);
            if(state?.notification?.length === 0 || state.notification === undefined){
                state.notification = action.payload;
                console.log("Notification 1 in");
            }else{
                state.notification?.push(action.payload);
                console.log("Notification 2 in");
            }
            console.log("state, action.payload", state.notification);
        },
        removeNotification(state, action){
            state.notification = []
        },
        setupSocket(state, action){
            state.socket = action.payload
        }
    }
});

export const { getUserNotification, setupSocket, removeNotification } = notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;