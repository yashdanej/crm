import { api } from "../../utils/Utils";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getTask = createAsyncThunk('getTask', async () => {
    try {
        const res = await api(`/tasks`, "get", false, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const getTaskAssign = createAsyncThunk('getTaskAssign', async (id) => {
    try {
        const res = await api(`/tasks/task-assigned/${id}`, "get", false, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const addTask = createAsyncThunk('addTask', async (data, { rejectWithValue }) => {
    try {
        console.log("data_addTask---------", data);
        const res = await api(`/tasks`, "post", data, false, true);
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

export const addAssignedTask = createAsyncThunk('addAssignedTask', async (data, { rejectWithValue }) => {
    try {
        console.log("data_addAssignedTask---------", data);
        const res = await api(`/tasks/task-assigned`, "post", data, false, true);
        console.log("res.data---", res);
        // Check if the API response indicates failure
        if (!res?.data?.success) {
            return rejectWithValue(res?.data?.message); // Reject with the error message
        }
        return res?.data;
    } catch (err) {
        console.log("err", err);
        return rejectWithValue(err.message); // Reject with the error message
    }
});

export const addFollowerTask = createAsyncThunk('addFollowerTask', async (data, { rejectWithValue }) => {
    try {
        console.log("addFollowerTask---------", data);
        const res = await api(`/tasks/task-follower`, "post", data, false, true);
        console.log("res.data---", res);
        // Check if the API response indicates failure
        if (!res?.data?.success) {
            return rejectWithValue(res?.data?.message); // Reject with the error message
        }
        return res?.data;
    } catch (err) {
        console.log("err", err);
        return rejectWithValue(err.message); // Reject with the error message
    }
});

export const deleteTask = createAsyncThunk("deleteTask", async (id) => {
    try {
        const res = await api(`/tasks/${id}`, "delete", false, false, true);
        return {id}
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const getTaskById = createAsyncThunk('getTaskById', async (id) => {
    try {
        const res = await api(`/tasks/${id}`, "get", false, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const updateTask = createAsyncThunk('updateTask', async (data, { rejectWithValue }) => {
    console.log("id, data", data);
    try {
        const res = await api(`/tasks/${data.id}`, "patch", data.data, false, true);
        // Check if the API response indicates failure
        if (!res.data.success) {
            return rejectWithValue(res.data.message); // Reject with the error message
        }
        return res.data;
    } catch (err) {
        console.log("err in updateTask", err);
        return rejectWithValue(err.message); // Reject with the error message
    }
});

export const getTaskStatus = createAsyncThunk('getTaskStatus', async () => {
    try {
        const res = await api(`/util/status`, "get", false, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const updateTaskStatus = createAsyncThunk('updateTaskStatus', async (data, { rejectWithValue }) => {
    console.log("id, data", data);
    try {
        const res = await api(`/tasks/${data.id}/${data.status}`, "patch", false, false, true);
        console.log("res------------", res);
        // Check if the API response indicates failure
        if (!res.data.success) {
            return rejectWithValue(res.data.message); // Reject with the error message
        }
        return res.data;
    } catch (err) {
        console.log("err in updateTask", err);
        return rejectWithValue(err.message); // Reject with the error message
    }
});

export const getTaskAssignedById = createAsyncThunk('getTaskAssignedById', async (id) => {
    try {
        const res = await api(`/tasks/task-assigned/${id}`, "get", false, false, true);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const updateTaskAssigned = createAsyncThunk('updateTaskAssigned', async (data, { rejectWithValue }) => {
    console.log("id, data", data);
    try {
        const res = await api(`/tasks/task-assigned/update/${data.id}`, "patch", data.data, false, true);
        // Check if the API response indicates failure
        if (!res.data.success) {
            return rejectWithValue(res.data.message); // Reject with the error message
        }
        return res.data;
    } catch (err) {
        console.log("err in updateTask", err);
        return rejectWithValue(err.message); // Reject with the error message
    }
});

export const getTaskFollowerById = createAsyncThunk('getTaskFollowerById', async (id) => {
    try {
        const res = await api(`/tasks/task-follower/${id}`, "get", false, false, true);
        console.log("res--------", res);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const updateTaskFollower = createAsyncThunk('updateTaskFollower', async (data, { rejectWithValue }) => {
    console.log("id, data", data);
    try {
        const res = await api(`/tasks/task-follower/update/${data.id}`, "patch", data.data, false, true);
        // Check if the API response indicates failure
        if (!res.data.success) {
            return rejectWithValue(res.data.message); // Reject with the error message
        }
        return res.data;
    } catch (err) {
        console.log("err in updateTask", err);
        return rejectWithValue(err.message); // Reject with the error message
    }
});

const TaskSlice = createSlice({
    name: "task",
    initialState: {
        task: {
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
        task_assign: {
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
        task_follower: {
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
        status: {
            isLoading: false,
            data: [],
            isError: false,
            success: false,
            message: "",
        }
    },
    extraReducers: (builder) => {
        // getTask
        builder.addCase(getTask.pending, (state, action) => {
            state.task.isLoading = true;
        });
        builder.addCase(getTask.fulfilled, (state, action) => {
            state.task.isLoading = false;
            state.task.data = action.payload;
        });
        builder.addCase(getTask.rejected, (state, action) => {
            console.log("error in getTask", action.payload);
            state.task.isLoading = false;
            state.task.isError = true;
        });

        // getTaskAssign
        builder.addCase(getTaskAssign.pending, (state, action) => {
            state.task_assign.isLoading = true;
        });
        builder.addCase(getTaskAssign.fulfilled, (state, action) => {
            state.task_assign.isLoading = false;
            state.task_assign.data = action.payload;
        });
        builder.addCase(getTaskAssign.rejected, (state, action) => {
            console.log("error in getTaskAssign", action.payload);
            state.task_assign.isLoading = false;
            state.task_assign.isError = true;
        });

        // addTask
        builder.addCase(addTask.pending, (state, action) => {
            state.task.isLoading = true;
        });
        builder.addCase(addTask.fulfilled, (state, action) => {
            console.log("action.payload----------", action.payload);
            state.task.isLoading = false;
            if(action.payload.success){
                state.task.data.push(action.payload.data[0]);
                state.task.success = true;
                state.task.message = action.payload.message;
            }else{
                state.task.success = false;
                state.task.message = action.payload.message;
            }
        });
        builder.addCase(addTask.rejected, (state, action) => {
            console.log("error in addTask", action.payload);
            state.task.isLoading = false;
            state.task.isError = true;
        });

        // addAssignedTask
        builder.addCase(addAssignedTask.pending, (state, action) => {
            state.task_assign.isLoading = true;
        });
        builder.addCase(addAssignedTask.fulfilled, (state, action) => {
            console.log("action.payload----------", action.payload);
            state.task_assign.isLoading = false;
            if(action.payload.success){
                // state.task_assign.data.push(action.payload.data[0]);
                state.task_assign.success = true;
                state.task_assign.message = action.payload.message;
            }else{
                state.task_assign.success = false;
                state.task_assign.message = action.payload.message;
            }
        });
        builder.addCase(addAssignedTask.rejected, (state, action) => {
            console.log("error in addAssignedTask", action.payload);
            state.task_assign.isLoading = false;
            state.task_assign.isError = true;
        });

        // deleteTask
        builder.addCase(deleteTask.pending, (state, action) => {
            state.task.isLoading = true;
        });
        builder.addCase(deleteTask.fulfilled, (state, action) => {
            console.log("action.payload deleteTask", action.payload);
            state.task.isLoading = false;
            state.task.success = true;
            state.task.isError = false;
            state.task.data = state.task.data.filter(field => field.id !== action.payload.id);
        });
        builder.addCase(deleteTask.rejected, (state, action) => {
            console.log("error in deleteTask", action.payload);
            console.log("action.payload deleteTask", action.payload);
            state.task.isLoading = false;
            state.task.isError = true;
            state.task.message = action.payload;
        });

        // addFollowerTask
        builder.addCase(addFollowerTask.pending, (state, action) => {
            state.task_follower.isLoading = true;
        });
        builder.addCase(addFollowerTask.fulfilled, (state, action) => {
            console.log("action.payload----------", action.payload);
            state.task_follower.isLoading = false;
            if(action.payload.success){
                // state.task_follower.data.push(action.payload.data[0]);
                state.task_follower.success = true;
                state.task_follower.message = action.payload.message;
            }else{
                state.task_follower.success = false;
                state.task_follower.message = action.payload.message;
            }
        });
        builder.addCase(addFollowerTask.rejected, (state, action) => {
            console.log("error in addFollowerTask", action.payload);
            state.task_follower.isLoading = false;
            state.task_follower.isError = true;
        });

        // getTaskById
        builder.addCase(getTaskById.pending, (state, action) => {
            state.task.edit.isLoading = true;
        });
        builder.addCase(getTaskById.fulfilled, (state, action) => {
            state.task.edit.isLoading = false;
            state.task.edit.id = action.payload[0].id;
            state.task.edit.data = action.payload;
        });
        builder.addCase(getTaskById.rejected, (state, action) => {
            console.log("error in getTaskById", action.payload);
            state.task.edit.isLoading = false;
            state.task.edit.isError = true;
        });

        // updateTask
        builder.addCase(updateTask.pending, (state, action) => {
            state.task.edit.isLoading = true;
        });
        builder.addCase(updateTask.fulfilled, (state, action) => {
            state.task.edit.isLoading = false;
            state.task.edit.data = [];
            state.task.edit.id = null;
            state.task.edit.success = true;
            state.task.edit.message = action.payload.message;
        });
        builder.addCase(updateTask.rejected, (state, action) => {
            console.log("error in updateTask", action.payload);
            state.task.edit.isLoading = false;
            state.task.edit.isError = true;
        });

        // getTaskStatus
        builder.addCase(getTaskStatus.pending, (state, action) => {
            state.status.isLoading = true;
        });
        builder.addCase(getTaskStatus.fulfilled, (state, action) => {
            state.status.isLoading = false;
            state.status.data = action.payload;
        });
        builder.addCase(getTaskStatus.rejected, (state, action) => {
            console.log("error in getTaskStatus", action.payload);
            state.status.isLoading = false;
            state.status.isError = true;
        });

        // updateTaskStatus
        builder.addCase(updateTaskStatus.pending, (state, action) => {
            state.status.isLoading = true;
        });
        builder.addCase(updateTaskStatus.fulfilled, (state, action) => {
            state.status.isLoading = false;
            console.log("action.payload updateTaskStatus", action.payload);
            // state.task.data = state.task.data.filter(field => field.id !== action.payload.id);
            // state.task.data.find(task => task.id === )
        });
        builder.addCase(updateTaskStatus.rejected, (state, action) => {
            console.log("error in updateTaskStatus", action.payload);
            state.status.isLoading = false;
            state.status.isError = true;
        });
        
        // getTaskAssignedById
        builder.addCase(getTaskAssignedById.pending, (state, action) => {
            state.task_assign.edit.isLoading = true;
        });
        builder.addCase(getTaskAssignedById.fulfilled, (state, action) => {
            state.task_assign.edit.isLoading = false;
            state.task_assign.edit.data = action.payload;
        });
        builder.addCase(getTaskAssignedById.rejected, (state, action) => {
            console.log("error in getTaskAssignedById", action.payload);
            state.task_assign.edit.isLoading = false;
            state.task_assign.edit.isError = true;
        });

        // updateTaskAssigned
        builder.addCase(updateTaskAssigned.pending, (state, action) => {
            state.task_assign.edit.isLoading = true;
        });
        builder.addCase(updateTaskAssigned.fulfilled, (state, action) => {
            state.task_assign.edit.isLoading = false;
            state.task_assign.edit.data = [];
        });
        builder.addCase(updateTaskAssigned.rejected, (state, action) => {
            console.log("error in updateTaskAssigned", action.payload);
            state.task_assign.edit.isLoading = false;
            state.task_assign.edit.isError = true;
        });

        // updateTaskFollower
        builder.addCase(updateTaskFollower.pending, (state, action) => {
            state.task_follower.edit.isLoading = true;
        });
        builder.addCase(updateTaskFollower.fulfilled, (state, action) => {
            state.task_follower.edit.isLoading = false;
            state.task_follower.edit.data = [];
        });
        builder.addCase(updateTaskFollower.rejected, (state, action) => {
            console.log("error in updateTaskFollower", action.payload);
            state.task_follower.edit.isLoading = false;
            state.task_follower.edit.isError = true;
        });

        // getTaskFollowerById
        builder.addCase(getTaskFollowerById.pending, (state, action) => {
            state.task_follower.edit.isLoading = true;
        });
        builder.addCase(getTaskFollowerById.fulfilled, (state, action) => {
            state.task_follower.edit.isLoading = false;
            state.task_follower.edit.data = action.payload;
        });
        builder.addCase(getTaskFollowerById.rejected, (state, action) => {
            console.log("error in getTaskFollowerById", action.payload);
            state.task_follower.edit.isLoading = false;
            state.task_follower.edit.isError = true;
        });
    },
    reducers: {
        emptyTaskEdit(state, action){
            state.task.edit.id = null;
            state.task.edit.isLoading = false;
            state.task.edit.data = [];
            state.task.edit.isError = false;
            state.task.edit.success = false;
            state.task.edit.message = "";
        },
        emptyTaskAssignEdit(state, action){
            state.task_assign.edit.id = null;
            state.task_assign.edit.isLoading = false;
            state.task_assign.edit.data = [];
            state.task_assign.edit.isError = false;
            state.task_assign.edit.success = false;
            state.task_assign.edit.message = "";
        },
        emptyTaskFollowerEdit(state, action){
            state.task_follower.edit.id = null;
            state.task_follower.edit.isLoading = false;
            state.task_follower.edit.data = [];
            state.task_follower.edit.isError = false;
            state.task_follower.edit.success = false;
            state.task_follower.edit.message = "";
        }
    }
})

export const { emptyTaskEdit, emptyTaskAssignEdit, emptyTaskFollowerEdit } = TaskSlice.actions;
export const taskReducer = TaskSlice.reducer;