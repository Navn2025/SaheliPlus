// src/redux/slices/userSlice.js
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../api/ApiConfigure"; // your axios instance

// Async thunk
export const getUser=createAsyncThunk(
    "user/getUser",
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const res=await axios.get("/me", {withCredentials: true});
            return res.data;
        } catch (err)
        {
            return rejectWithValue(
                err.response?.data||{message: "Failed to fetch user"}
            );
        }
    }
);

const userSlice=createSlice({
    name: "user",
    initialState: {
        user: null,
        role: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearUser: (state) =>
        {
            state.user=null;
            state.role=null;
            state.error=null;
        },
    },
    extraReducers: (builder) =>
    {
        builder
            .addCase(getUser.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(getUser.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.user=action.payload.user;
                state.role=action.payload.role;
            })
            .addCase(getUser.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Something went wrong";
            });
    },
});

export const {clearUser}=userSlice.actions;
export default userSlice.reducer;
