import { assignedReducer, countriesReducer, leadsReducer, sourceReducer, statusReducer } from "./slices/LeadSlices";
import { notificationReducer } from "./slices/Notification";
import userSlice from "./slices/UserSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        user: userSlice,
        status: statusReducer,
        source: sourceReducer,
        assigned: assignedReducer,
        countries: countriesReducer,
        leads: leadsReducer,
        notification: notificationReducer
    }
});

export default store;