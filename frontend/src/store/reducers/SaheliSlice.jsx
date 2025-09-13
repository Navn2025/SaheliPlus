import {createSlice} from "@reduxjs/toolkit";
import {CreateSaheli, AddSaheliService, GetSaheliBookings, ApproveSaheliBooking, GetServicesRequired, BookCustomerService} from "../actions/SaheliActions";
import {sendOtp, verifyOtp} from "../actions/CommonActions";

const initialState={
    saheliData: [],   // stores all saheli records
    services: [],     // saheli's services
    bookings: [],     // saheli's bookings
    servicesRequired: [], // services required by customers
    loading: false,
    error: null,
};

const SaheliSlice=createSlice({
    name: "saheli",
    initialState,
    reducers: {
        setSaheliData: (state, action) =>
        {
            state.saheliData=action.payload;
        },
        setSaheliServices: (state, action) =>
        {
            state.services=action.payload;
        },
        setSaheliBookings: (state, action) =>
        {
            state.bookings=action.payload;
        },
        setServicesRequired: (state, action) =>
        {
            state.servicesRequired=action.payload;
        },
    },
    extraReducers: (builder) =>
    {
        builder
            .addCase(sendOtp.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            }
            )
            .addCase(sendOtp.fulfilled, (state, action) =>
            {
                state.loading=false;
                // push new record into array (instead of replacing entire data)
                state.saheliData.push(action.payload);
            }
            )
            .addCase(sendOtp.rejected, (state, action) =>
            {
                state.loading=false;
                // action.payload if using rejectWithValue, else action.error.message
                state.error=action.payload||action.error.message;
            }
            )
            .addCase(verifyOtp.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            }
            )
            .addCase(verifyOtp.fulfilled, (state, action) =>
            {
                state.loading=false;
                // push new record into array (instead of replacing entire data)

            }
            )


            .addCase(verifyOtp.rejected, (state, action) =>
            {
                state.loading=false;
                // action.payload if using rejectWithValue, else action.error.message
                state.error=action.payload||action.error.message;
            }
            );
        builder
            // when creating a saheli starts
            .addCase(CreateSaheli.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })

            // when creation is successful
            .addCase(CreateSaheli.fulfilled, (state, action) =>
            {
                state.loading=false;
                // push new record into array (instead of replacing entire data)
            })

            // when creation fails
            .addCase(CreateSaheli.rejected, (state, action) =>
            {
                state.loading=false;
                // action.payload if using rejectWithValue, else action.error.message
                state.error=action.payload||action.error.message;
            });
    },
});

export const {setSaheliData, setSaheliServices, setSaheliBookings, setServicesRequired}=SaheliSlice.actions;
export default SaheliSlice.reducer;
