import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../api/ApiConfigure';


export const GetSaheliServices=createAsyncThunk(
    'saheli/getServices',
    async (saheliId, {rejectWithValue}) =>
    {
        try
        {
            // Assuming a route like '/saheli/:id/services' to get services for a specific Saheli.
            const res=await api.get(`/saheli/${saheliId}/services`);
            return res.data.services;
        } catch (err)
        {
            return rejectWithValue(err.response?.data||{message: err.message});
        }
    }
);

/**
 * Thunk to add a new service for the logged-in Saheli.
 * Corresponds to: POST /saheli/:id/saheliService
 */
export const AddSaheliService=createAsyncThunk(
    'saheli/addService',
    async ({saheliId, serviceData}, {rejectWithValue}) =>
    {
        try
        {
            const res=await api.post(`/saheli/${saheliId}/saheliService`, serviceData);
            return res.data;
        } catch (err)
        {
            return rejectWithValue(err.response?.data||{message: err.message});
        }
    }
);

/**
 * Thunk to get all bookings for the logged-in Saheli.
 * Corresponds to: GET /saheli/:id/listAllBookings
 */
export const GetSaheliBookings=createAsyncThunk(
    'saheli/getBookings',
    async (saheliId, {rejectWithValue}) =>
    {
        try
        {
            const res=await api.get(`/saheli/${saheliId}/listAllBookings`);
            return res.data.bookings;
        } catch (err)
        {
            return rejectWithValue(err.response?.data||{message: err.message});
        }
    }
);

/**
 * Thunk to approve a specific booking.
 * Corresponds to: PATCH /saheli/:saheliId/bookings/:bookingId
 */
export const ApproveSaheliBooking=createAsyncThunk(
    'saheli/approveBooking',
    async ({saheliId, bookingId, status}, {rejectWithValue}) =>
    {
        try
        {
            const res=await api.patch(`/saheli/${saheliId}/bookings/${bookingId}`, {status});
            return res.data.booking; // Return the updated booking
        } catch (err)
        {
            return rejectWithValue(err.response?.data||{message: err.message});
        }
    }
);

/**
 * Thunk to get all services required by customers for Sahelis to browse.
 * Corresponds to: GET /saheli/customerOfferedService
 */
export const GetServicesRequired=createAsyncThunk(
    'saheli/getServicesRequired',
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const res=await api.get('/saheli/customerOfferedService');
            return res.data.services;
        } catch (err)
        {
            return rejectWithValue(err.response?.data||{message: err.message});
        }
    }
);


const saheliSlice=createSlice({
    name: 'saheli',
    initialState: {
        services: [],         // Saheli's own services
        bookings: [],         // Bookings received by the Saheli
        servicesRequired: [], // Service requests from customers
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: builder =>
    {
        builder
            // Get Saheli's own services
            .addCase(GetSaheliServices.pending, (state) => {state.loading=true;})
            .addCase(GetSaheliServices.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.services=action.payload;
            })
            .addCase(GetSaheliServices.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload;
            })
            // Add a new service
            .addCase(AddSaheliService.pending, (state) => {state.loading=true;})
            .addCase(AddSaheliService.fulfilled, (state, action) =>
            {
                state.loading=false;
                // Add the newly created service to the state
                if (action.payload.service)
                {
                    state.services.push(action.payload.service);
                }
            })
            .addCase(AddSaheliService.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload;
            })
            // Get Saheli's bookings
            .addCase(GetSaheliBookings.pending, (state) => {state.loading=true;})
            .addCase(GetSaheliBookings.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.bookings=action.payload;
            })
            .addCase(GetSaheliBookings.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload;
            })
            // Approve a booking
            .addCase(ApproveSaheliBooking.fulfilled, (state, action) =>
            {
                const updatedBooking=action.payload;
                const index=state.bookings.findIndex(b => b._id===updatedBooking._id);
                if (index!==-1)
                {
                    state.bookings[index]=updatedBooking; // Update the specific booking in the array
                }
            })
            // Get services required by customers
            .addCase(GetServicesRequired.pending, (state) => {state.loading=true;})
            .addCase(GetServicesRequired.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.servicesRequired=action.payload;
            })
            .addCase(GetServicesRequired.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload;
            });
    }
});

export default saheliSlice.reducer;