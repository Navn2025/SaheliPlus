
import {createSlice} from "@reduxjs/toolkit";
import {CreateCustomer, UpdateCustomerProfile} from "../actions/CustomerActions";
const initialState={
    customerData: [],
    loading: false,
    error: null
};
const CustomerSlice=createSlice({
    name: "customer",
    initialState,
    reducers: {
        setCustomerData: (state, action) =>
        {
            state.customerData=action.payload;
        },
    },
    extraReducers: (builder) =>
    {
        builder
            .addCase(CreateCustomer.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            }
            )

            .addCase(CreateCustomer.fulfilled, (state, action) =>
            {
                state.loading=false;
                // push new record into array (instead of replacing entire data)
                state.customerData.push(action.payload);
            }
            )
            .addCase(CreateCustomer.rejected, (state, action) =>
            {
                state.loading=false;
                // action.payload if using rejectWithValue, else action.error.message
                state.error=action.payload||action.error.message;
            }
            )
            .addCase(UpdateCustomerProfile.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            }
            )

            .addCase(UpdateCustomerProfile.fulfilled, (state, action) =>
            {
                state.loading=false;
                // push new record into array (instead of replacing entire data)
                state.customerData.push(action.payload);
            }
            )
            .addCase(UpdateCustomerProfile.rejected, (state, action) =>
            {
                state.loading=false;
                // action.payload if using rejectWithValue, else action.error.message
                state.error=action.payload||action.error.message;
            }
            );

    }
});

export const {setCustomerData}=CustomerSlice.actions;
export default CustomerSlice.reducer;