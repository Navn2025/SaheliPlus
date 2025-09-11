import {createSlice} from "@reduxjs/toolkit";
import {CreateSaheli} from "../actions/SaheliActions";
import {sendOtp, verifyOtp} from "../actions/CommonActions";

const initialState={
    saheliData: [],   // stores all saheli records
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
                state.saheliData.push(action.payload);
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
                state.saheliData.push(action.payload);
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

export const {setSaheliData}=SaheliSlice.actions;
export default SaheliSlice.reducer;
