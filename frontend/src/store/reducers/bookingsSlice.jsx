import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import api from '../../api/ApiConfigure'

/*
  Back-end route assumptions (adjust base paths if needed):
  - GET  /api/saheli/:id/listAllBookings            -> returns {bookings: [...]}
  - POST /api/user/:id/bookSaheli/:serviceId        -> customer books a saheli (returns bookings)
  - POST /api/saheli/:id/bookCustomerService/:serviceId -> saheli books a customer service
  - PATCH /api/saheli/:saheliId/bookings/:bookingId -> saheli approve/reject
  - PATCH /api/user/:customerId/bookings/:bookingId -> customer approve/reject (acceptOrRejectSaheli.route)
*/

export const fetchSaheliBookings=createAsyncThunk(
    'bookings/fetchSaheliBookings',
    async ({saheliId}, {rejectWithValue}) =>
    {
        try
        {
            const res=await api.get(`/saheli/${saheliId}/listAllBookings`)
            return res.data
        } catch (err)
        {
            return rejectWithValue(err.response?.data||{message: err.message})
        }
    }
)

export const bookSaheli=createAsyncThunk(
    'bookings/bookSaheli',
    async ({saheliId, serviceId, payload}, {rejectWithValue}) =>
    {
        try
        {
            const res=await api.post(`/customer/${saheliId}/bookSaheli/${serviceId}`, payload)
            return res.data
        } catch (err)
        {
            return rejectWithValue(err.response?.data||{message: err.message})
        }
    }
)

export const bookCustomerService=createAsyncThunk(
    'bookings/bookCustomerService',
    async ({customerId, serviceId, payload}, {rejectWithValue}) =>
    {
        try
        {
            const res=await api.post(`/saheli/${customerId}/bookCustomerService/${serviceId}`, payload)
            return res.data
        } catch (err)
        {
            return rejectWithValue(err.response?.data||{message: err.message})
        }
    }
)

export const fetchCustomerBookings=createAsyncThunk(
    'bookings/fetchCustomerBookings',
    async (_, {rejectWithValue}) =>
    {
        try
        {
            // Use /api/me to fetch the current authenticated user's data (bookings included)
            const res=await api.get('/me')
            // backend returns { user, role }
            const bookings=res.data?.user?.bookings||[]
            return {bookings}
        } catch (err)
        {
            return rejectWithValue(err.response?.data||{message: err.message})
        }
    }
)

export const updateSaheliBookingStatus=createAsyncThunk(
    'bookings/updateSaheliBookingStatus',
    async ({saheliId, bookingId, status}, {rejectWithValue}) =>
    {
        try
        {
            const res=await api.patch(`/saheli/${saheliId}/bookings/${bookingId}`, {status})
            return res.data
        } catch (err)
        {
            return rejectWithValue(err.response?.data||{message: err.message})
        }
    }
)

export const updateCustomerBookingStatus=createAsyncThunk(
    'bookings/updateCustomerBookingStatus',
    async ({customerId, bookingId, status}, {rejectWithValue}) =>
    {
        try
        {
            const res=await api.patch(`/customer/${customerId}/bookings/${bookingId}`, {status})
            return res.data
        } catch (err)
        {
            return rejectWithValue(err.response?.data||{message: err.message})
        }
    }
)

const bookingsSlice=createSlice({
    name: 'bookings',
    initialState: {
        list: [],
        loading: false,
        error: null
    },
    reducers: {
        clearBookingsError(state) {state.error=null}
    },
    extraReducers: builder =>
    {
        builder
            .addCase(fetchSaheliBookings.pending, state => {state.loading=true; state.error=null})
            .addCase(fetchSaheliBookings.fulfilled, (state, action) =>
            {
                state.loading=false
                state.list=action.payload.bookings||[]
            })
            .addCase(fetchSaheliBookings.rejected, (state, action) => {state.loading=false; state.error=action.payload})

            .addCase(bookSaheli.pending, state => {state.loading=true; state.error=null})
            .addCase(bookSaheli.fulfilled, (state, action) =>
            {
                state.loading=false
                if (action.payload?.bookings) state.list=action.payload.bookings
            })
            .addCase(bookSaheli.rejected, (state, action) => {state.loading=false; state.error=action.payload})

            .addCase(bookCustomerService.pending, state => {state.loading=true; state.error=null})
            .addCase(bookCustomerService.fulfilled, (state, action) =>
            {
                state.loading=false
                if (action.payload?.bookings) state.list=action.payload.bookings
            })
            .addCase(bookCustomerService.rejected, (state, action) => {state.loading=false; state.error=action.payload})

            .addCase(updateSaheliBookingStatus.pending, state => {state.loading=true; state.error=null})
            .addCase(updateSaheliBookingStatus.fulfilled, (state, action) =>
            {
                state.loading=false
                // action.payload.booking should contain updated booking
                if (action.payload?.booking)
                {
                    const idx=state.list.findIndex(b => b._id===action.payload.booking._id)
                    if (idx>=0) state.list[idx]=action.payload.booking
                }
            })
            .addCase(updateSaheliBookingStatus.rejected, (state, action) => {state.loading=false; state.error=action.payload})

            .addCase(updateCustomerBookingStatus.pending, state => {state.loading=true; state.error=null})
            .addCase(updateCustomerBookingStatus.fulfilled, (state, action) =>
            {
                state.loading=false
                if (action.payload?.booking)
                {
                    const idx=state.list.findIndex(b => b._id===action.payload.booking._id)
                    if (idx>=0) state.list[idx]=action.payload.booking
                }
            })
            .addCase(updateCustomerBookingStatus.rejected, (state, action) => {state.loading=false; state.error=action.payload})
    }
})

export const {clearBookingsError}=bookingsSlice.actions
export default bookingsSlice.reducer
