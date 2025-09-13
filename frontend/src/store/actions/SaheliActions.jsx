import axios from '../../api/ApiConfigure';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {setSaheliData} from '../reducers/SaheliSlice';

export const CreateSaheli=createAsyncThunk(
    "saheli/fetchData",
    async (formData, {rejectWithValue, dispatch}) =>
    {
        try
        {
            const response=await axios.post(
                "/auth/register/saheli",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true, // ✅ keep inside same object
                }
            );

            console.log("API Response:", response.data);
            localStorage.setItem("user", JSON.stringify(response.data));


            // ✅ Example: you can dispatch another action here if needed
            dispatch(setSaheliData(response.data));

            return response.data;
        } catch (error)
        {
            console.error("API Error:", error);
            return rejectWithValue(error.response?.data||"Something went wrong");
        }
    }
);

export const UpdateSaheliProfile=createAsyncThunk(
    'saheli/updateProfile',
    async (data, {rejectWithValue, dispatch}) =>
    {
        try
        {
            const response=await axios.post('/auth/register/saheli/profile', data, {
                headers: {"Content-Type": "multipart/form-data"},
                withCredentials: true,
            });
            console.log("API Response:", response.data);
            dispatch(setSaheliData(response.data));
            return response.data;
        }
        catch (error)
        {
            console.error("API Error:", error);
            return rejectWithValue(error.response?.data||"Something went wrong");
        }

    }
);

// Add service offered by Saheli
export const AddSaheliService=createAsyncThunk(
    'saheli/addService',
    async (serviceData, {rejectWithValue}) =>
    {
        try
        {
            const response=await axios.post('/saheli/add-service', serviceData, {
                withCredentials: true,
            });
            console.log("Service Added:", response.data);
            return response.data;
        } catch (error)
        {
            console.error("API Error:", error);
            return rejectWithValue(error.response?.data||"Failed to add service");
        }
    }
);

// Get all bookings for Saheli
export const GetSaheliBookings=createAsyncThunk(
    'saheli/getBookings',
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const response=await axios.get('/saheli/bookings', {
                withCredentials: true,
            });
            return response.data;
        } catch (error)
        {
            console.error("API Error:", error);
            return rejectWithValue(error.response?.data||"Failed to fetch bookings");
        }
    }
);

// Approve booking by Saheli
export const ApproveSaheliBooking=createAsyncThunk(
    'saheli/approveBooking',
    async (bookingId, {rejectWithValue}) =>
    {
        try
        {
            const response=await axios.put(`/saheli/approve-booking/${bookingId}`, {}, {
                withCredentials: true,
            });
            return response.data;
        } catch (error)
        {
            console.error("API Error:", error);
            return rejectWithValue(error.response?.data||"Failed to approve booking");
        }
    }
);

// Get services required by customers
export const GetServicesRequired=createAsyncThunk(
    'saheli/getServicesRequired',
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const response=await axios.get('/saheli/services-required', {
                withCredentials: true,
            });
            return response.data;
        } catch (error)
        {
            console.error("API Error:", error);
            return rejectWithValue(error.response?.data||"Failed to fetch required services");
        }
    }
);

// Book customer service by Saheli
export const BookCustomerService=createAsyncThunk(
    'saheli/bookCustomerService',
    async (serviceData, {rejectWithValue}) =>
    {
        try
        {
            const response=await axios.post('/saheli/book-customer-service', serviceData, {
                withCredentials: true,
            });
            return response.data;
        } catch (error)
        {
            console.error("API Error:", error);
            return rejectWithValue(error.response?.data||"Failed to book service");
        }
    }
);
