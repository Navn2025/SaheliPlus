import {createSlice} from '@reduxjs/toolkit';
import {LoginUser, logoutUser, sendOtp, verifyOtp, getUserDetails} from '../actions/CommonActions';

const initialState={
    isAuthenticated: false,
    user: null,
    role: null,
    token: null,
    loading: false,
    error: null,
    otpStatus: {
        sent: false,
        verified: false,
        loading: false,
        error: null
    }
};

const authSlice=createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearAuth: () =>
        {
            return initialState;
        },
        clearError: (state) =>
        {
            state.error=null;
            state.otpStatus.error=null;
        },
        setAuth: (state, action) =>
        {
            state.isAuthenticated=true;
            state.user=action.payload.user;
            state.role=action.payload.role;
            state.token=action.payload.token;
        }
    },
    extraReducers: (builder) =>
    {
        builder
            // Login
            .addCase(LoginUser.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(LoginUser.fulfilled, (state, action) =>
            {
                state.isAuthenticated=true;
                state.user=action.payload.user;
                state.role=action.payload.role;
                state.token=action.payload.token;
                state.loading=false;
                state.error=null;
            })
            .addCase(LoginUser.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload||"Login failed";
            })

            // Logout
            .addCase(logoutUser.pending, (state) =>
            {
                state.loading=true;
            })
            .addCase(logoutUser.fulfilled, () =>
            {
                return initialState;
            })
            .addCase(logoutUser.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload||"Logout failed";
            })

            // Get User Details
            .addCase(getUserDetails.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(getUserDetails.fulfilled, (state, action) =>
            {
                state.user=action.payload.user;
                state.role=action.payload.role;
                state.isAuthenticated=true;
                state.loading=false;
                state.error=null;
            })
            .addCase(getUserDetails.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload||"Failed to fetch user details";
            })

            // OTP send cases
            .addCase(sendOtp.pending, (state) =>
            {
                state.otpStatus.loading=true;
                state.otpStatus.error=null;
            })
            .addCase(sendOtp.fulfilled, (state) =>
            {
                state.otpStatus.loading=false;
                state.otpStatus.sent=true;
            })
            .addCase(sendOtp.rejected, (state, action) =>
            {
                state.otpStatus.loading=false;
                state.otpStatus.error=action.payload||"Failed to send OTP";
            })

            // OTP verify cases
            .addCase(verifyOtp.pending, (state) =>
            {
                state.otpStatus.loading=true;
                state.otpStatus.error=null;
            })
            .addCase(verifyOtp.fulfilled, (state) =>
            {
                state.otpStatus.loading=false;
                state.otpStatus.verified=true;
            })
            .addCase(verifyOtp.rejected, (state, action) =>
            {
                state.otpStatus.loading=false;
                state.otpStatus.error=action.payload||"Failed to verify OTP";
            });
    }
});

export const {clearError, setAuth}=authSlice.actions;
export default authSlice.reducer;
