
import {createSlice} from "@reduxjs/toolkit";
import {LoginUser} from "../actions/CommonActions";
const initialState={
    loginData: [],
    loading: false,
    error: null
};
const LoginSlice=createSlice({
    name: "login",
    initialState,
    reducers: {
        setLoginData: (state, action) =>
        {
            state.loginData=action.payload;
        },
    },
    extraReducers: (builder) =>
    {
        builder
            .addCase(LoginUser.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            }
            )
            .addCase(LoginUser.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.loginData.push(action.payload);
            }
            )
            .addCase(LoginUser.rejected, (state, action) =>
            {   
                state.loading=false;
                state.error=action.payload||action.error.message;
            }
            )
    }
}); 
export const {setLoginData}=LoginSlice.actions;
export default LoginSlice.reducer;