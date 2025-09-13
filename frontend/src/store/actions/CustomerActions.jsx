import axios from '../../api/ApiConfigure';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {setCustomerData} from '../reducers/CustomerSlice';

export const CreateCustomer=createAsyncThunk(
    'customer/fetchData',
    async (formData, {rejectWithValue, dispatch}) =>
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
            localStorage.setItem("user", JSON.stringify(response.data));

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
    async (data, {rejectWithValue, dispatch}) =>
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

// Get all services offered by Sahelis
export const GetAllServicesOffered=createAsyncThunk(
    'customer/getServicesOffered',
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const response=await axios.get('/customer/services-offered', {
                withCredentials: true,
            });
            return response.data;
        } catch (error)
        {
            console.error("API Error:", error);
            return rejectWithValue(error.response?.data||"Failed to fetch services");
        }
    }
);

// Book a Saheli
export const BookSaheli=createAsyncThunk(
    'customer/bookSaheli',
    async (bookingData, {rejectWithValue}) =>
    {
        try
        {
            const response=await axios.post('/customer/book-saheli', bookingData, {
                withCredentials: true,
            });
            return response.data;
        } catch (error)
        {
            console.error("API Error:", error);
            return rejectWithValue(error.response?.data||"Failed to book Saheli");
        }
    }
);

// Accept or reject Saheli
export const AcceptOrRejectSaheli=createAsyncThunk(
    'customer/acceptOrRejectSaheli',
    async ({bookingId, status}, {rejectWithValue}) =>
    {
        try
        {
            const response=await axios.put(`/customer/booking/${bookingId}/status`, {status}, {
                withCredentials: true,
            });
            return response.data;
        } catch (error)
        {
            console.error("API Error:", error);
            return rejectWithValue(error.response?.data||"Failed to update booking status");
        }
    }
);

// Add service requirement by customer
export const AddServiceRequirement=createAsyncThunk(
    'customer/addServiceRequirement',
    async (serviceData, {rejectWithValue}) =>
    {
        try
        {
            const response=await axios.post('/customer/add-service', serviceData, {
                withCredentials: true,
            });
            return response.data;
        } catch (error)
        {
            console.error("API Error:", error);
            return rejectWithValue(error.response?.data||"Failed to add service requirement");
        }
    }
);

// Get all Saheli bookings for customer
export const GetCustomerBookings=createAsyncThunk(
    'customer/getBookings',
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const response=await axios.get('/customer/saheli-bookings', {
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
