/* eslint-disable react-refresh/only-export-components */
import axios from '../../api/ApiConfigure';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {setLoginData} from '../reducers/LoginSlice'
export const sendOtp=createAsyncThunk(
    'common/sendOtp',
    async (data, {rejectWithValue, dispatch}) =>
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
    async (data, {rejectWithValue, dispatch}) =>
    {
        try
        {
            const response=await axios.post('/auth/login', data, {
                withCredentials: true,
            });
            console.log("API Response:", response.data);
            localStorage.setItem("user", JSON.stringify(response.data));

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
// eslint-disable-next-line react-refresh/only-export-components
export const getUserDetails=createAsyncThunk(
    "user/getUser",
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const res=await axios.get("/me", {withCredentials: true});
            localStorage.setItem("user", JSON.stringify(res.data));

            console.log(res.data)
            return res.data;
        } catch (err)
        {
            return rejectWithValue(
                err.response?.data||{message: "Failed to fetch user"}
            );
        }
    }
);
