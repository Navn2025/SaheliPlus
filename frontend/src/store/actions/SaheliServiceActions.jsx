import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../api/ApiConfigure";
import {setCustomerData} from "../reducers/CustomerSlice";

export const getSaheliService=createAsyncThunk(
    'customer/fetchData',
    async (formData, {rejectWithValue, dispatch}) =>
    {
        console.log(formData)
        try
        {
            const response=await axios.post(
                "/",
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