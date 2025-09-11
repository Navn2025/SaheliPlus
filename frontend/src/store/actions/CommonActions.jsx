import axios from '../../api/ApiConfigure';
import {createAsyncThunk} from '@reduxjs/toolkit';
export const sendOtp=createAsyncThunk(
    'common/sendOtp',
    async (data, {rejectWithValue,dispatch}) =>
    {
        try
        {
            const response=await axios.post('/auth/send-otp', data);
            console.log("API Response:", response.data);
            return response.data;
        }
        catch (error)
        {
            console.error("API Error:", error);

            // return better error message
            return rejectWithValue(
                error.response?.data||error.message||"Something went wrong"
            );
        }
    }
);
export const verifyOtp=createAsyncThunk(
    'common/verifyOtp',
    async (data, {rejectWithValue}) =>
    {
        try
        {
            const response=await axios.post('/auth/verify-otp', data);
            console.log("API Response:", response.data);
            return response.data;
        }
        catch (error)
        {
            console.error("API Error:", error);
            // return better error message
            return rejectWithValue(
                error.response?.data||error.message||"Something went wrong"
            );
        }
    }
);
export const logoutUser=createAsyncThunk(
    'common/logoutUser',
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const response=await axios.post('/auth/logout', {}, {
                withCredentials: true,
            });
            console.log("API Response:", response.data);
            return response.data;
        }
        catch (error)
        {
            console.error("API Error:", error);
            // return better error message
            return rejectWithValue(
                error.response?.data||error.message||"Something went wrong"
            );
        }

    }
);
export const LoginUser=createAsyncThunk(
    'common/loginUser',
    async (data, {rejectWithValue,dispatch}) =>
    {
        try
        {
            const response=await axios.post('/auth/login', data, {
                withCredentials: true,
            });
            console.log("API Response:", response.data);
            dispatch(setLoginData(response.data));
            return response.data;
        }
        catch (error)
        {
            console.error("API Error:", error);
            // return better error message
            return rejectWithValue(
                error.response?.data||error.message||"Something went wrong"
            );
        }
    }
);