import { attachmentReducer } from "./slices/AttachmentSlices";
import { customerReducer } from "./slices/CustomerSlices";
import DevSlices from "./slices/DevSlices";
import { assignedReducer, countriesReducer, leadsReducer, sourceReducer, statusReducer } from "./slices/LeadSlices";
import { noteReducer } from "./slices/NoteSlices";
import { notificationReducer } from "./slices/Notification";
import { reminderReducer } from "./slices/ReminderSlice";
import { setupReducer } from "./slices/SetupSlices";
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
        notification: notificationReducer,
        setup: setupReducer,
        note: noteReducer,
        reminder: reminderReducer,
        attachment: attachmentReducer,
        customer: customerReducer,
        dev: DevSlices
    }
});

export default store;