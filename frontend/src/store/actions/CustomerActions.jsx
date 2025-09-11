import axios from '../../api/ApiConfigure';
import {createAsyncThunk} from '@reduxjs/toolkit';
import { setCustomerData } from '../reducers/CustomerSlice';

export const CreateCustomer=createAsyncThunk(
    'customer/fetchData',
    async (formData, {rejectWithValue,dispatch}) =>
    {
        console.log(formData)
        try
        {
            const response=await axios.post(
                "/auth/register/customer",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true, // ✅ keep inside same object
                }
            );
            console.log(formData)
            console.log("API Response:", response.data);
            dispatch(setCustomerData(response.data));
            return response.data;
        } catch (error)
        {
            console.error("API Error:", error);
            return rejectWithValue(error.response?.data||"Something went wrong");
        }
    }
);
export const UpdateCustomerProfile=createAsyncThunk(
    'customer/updateProfile',
    async (data, {rejectWithValue,dispatch}) =>
    {
        try
        {
            const response=await axios.post('/auth/register/customer/profile', data, {

                withCredentials: true,
            });
            console.log("API Response:", response.data);
            dispatch(setCustomerData(response.data));
                return response.data;
        }
        catch (error)
        {
            console.error("API Error:", error);
            return rejectWithValue(error.response?.data||"Something went wrong");
        }

    }
);
