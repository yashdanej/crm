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

export const getTaskByIdView = createAsyncThunk('getTaskByIdView', async (id) => {
    try {
        const res = await api(`/tasks/${id}`, "get", false, false, true);
        console.log("res.data.res", res);
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


export const addTaskComment = createAsyncThunk('addTaskComment', async (data, { rejectWithValue }) => {
    try {
        console.log("data_addTaskComment---------", data);
        const res = await api(`/tasks/task-comment`, "post", data, true, true);
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

export const getTaskComments = createAsyncThunk('getTaskComments', async (id) => {
    try {
        const res = await api(`/tasks/task-comment/${id}`, "get", false, false, true);
        console.log("res--------", res);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const addTaskTimer = createAsyncThunk('addTaskTimer', async (data, { rejectWithValue }) => {
    try {
        console.log("data_addTaskTimer---------", data);
        const res = await api(`/tasks/task-timer`, "post", data, false, true);
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

export const getTaskTimer = createAsyncThunk('getTaskTimer', async (id) => {
    try {
        const res = await api(`/tasks/task-timer/get?task_id=${id}`, "get", false, false, true);
        console.log("res--------", res);
        return res.data.data;
    } catch (err) {
        console.log("err", err);
        throw err;
    }
});

export const updateTaskTimer = createAsyncThunk('updateTaskTimer', async (id, { rejectWithValue }) => {
    try {
        const res = await api(`/tasks/task-timer/end/${id}`, "patch", false, false, true);
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
        modal: [],
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
        },
        comment: {
            isLoading: false,
            data: [],
            isError: false,
            success: false,
            message: "",
        },
        timer: {
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
                state.modal = action.payload.data[0];
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

        // getTaskByIdView
        builder.addCase(getTaskByIdView.pending, (state, action) => {
            console.log("pending in getTaskByIdView", action.payload);
        });
        builder.addCase(getTaskByIdView.fulfilled, (state, action) => {
            console.log("action", action.payload);
            state.modal = action.payload[0];
        });
        builder.addCase(getTaskByIdView.rejected, (state, action) => {
            console.log("error in getTaskByIdView", action.payload);
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
            state.modal = action.payload.data[0];
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

        // addTaskComment
        builder.addCase(addTaskComment.pending, (state, action) => {
            state.comment.isLoading = true;
        });
        builder.addCase(addTaskComment.fulfilled, (state, action) => {
            console.log("action.payload----------", action.payload);
            state.comment.isLoading = false;
            if(action.payload.success){
                state.comment.data.push(action.payload.data[0]);
                state.comment.success = true;
                state.comment.message = action.payload.message;
            }else{
                state.comment.success = false;
                state.comment.message = action.payload.message;
            }
        });
        builder.addCase(addTaskComment.rejected, (state, action) => {
            console.log("error in addTaskComment", action.payload);
            state.comment.isLoading = false;
            state.comment.isError = true;
        });

        // getTaskComment
        builder.addCase(getTaskComments.pending, (state, action) => {
            state.comment.isLoading = true;
        });
        builder.addCase(getTaskComments.fulfilled, (state, action) => {
            state.comment.isLoading = false;
            console.log("action...pa", action.payload);
            state.comment.data = action.payload;
        });
        builder.addCase(getTaskComments.rejected, (state, action) => {
            console.log("error in getTaskComments", action.payload);
            state.comment.isLoading = false;
            state.comment.isError = true;
        });

        // addTaskTimer
        builder.addCase(addTaskTimer.pending, (state, action) => {
            state.timer.isLoading = true;
        });
        builder.addCase(addTaskTimer.fulfilled, (state, action) => {
            console.log("action.payload----------", action.payload);
            state.timer.isLoading = false;
            if(action.payload.success){
                state.timer.data.push(action.payload.data[0]);
                state.timer.success = true;
                state.timer.message = action.payload.message;
            }else{
                state.timer.success = false;
                state.timer.message = action.payload.message;
            }
        });
        builder.addCase(addTaskTimer.rejected, (state, action) => {
            console.log("error in addTaskTimer", action.payload);
            state.timer.isLoading = false;
            state.timer.isError = true;
        });

        // getTaskTimer
        builder.addCase(getTaskTimer.pending, (state, action) => {
            state.timer.isLoading = true;
        });
        builder.addCase(getTaskTimer.fulfilled, (state, action) => {
            state.timer.isLoading = false;
            console.log("action...pa", action.payload);
            state.timer.data = action.payload;
        });
        builder.addCase(getTaskTimer.rejected, (state, action) => {
            console.log("error in getTaskTimer", action.payload);
            state.timer.isLoading = false;
            state.timer.isError = true;
        });

         // updateTaskTimer
         builder.addCase(updateTaskTimer.pending, (state, action) => {
            state.timer.isLoading = true;
        });
        builder.addCase(updateTaskTimer.fulfilled, (state, action) => {
            state.timer.isLoading = false;
        });
        builder.addCase(updateTaskTimer.rejected, (state, action) => {
            console.log("error in updateTaskTimer", action.payload);
            state.timer.isLoading = false;
            state.timer.isError = true;
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
        },
        emptyModal(state, action){
            state.modal = [];
        },
        emptyComment(state, action){
            state.comment.isLoading = false
            state.comment.data = []
            state.comment.isError = false;
            state.comment.success = false;
            state.comment.message = "";
        }
    }
})

export const { emptyTaskEdit, emptyTaskAssignEdit, emptyTaskFollowerEdit, emptyModal, emptyComment } = TaskSlice.actions;
export const taskReducer = TaskSlice.reducer;