import axios from '../../api/ApiConfigure';
import {createAsyncThunk} from '@reduxjs/toolkit';

export const CreateSaheli = createAsyncThunk(
    "saheli/fetchData",
    async (formData, { rejectWithValue, dispatch }) => {
      try {
        const response = await axios.post(
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
  
        // ✅ Example: you can dispatch another action here if needed
        dispatch(setSaheliData(response.data));
  
        return response.data;
      } catch (error) {
        console.error("API Error:", error);
        return rejectWithValue(error.response?.data || "Something went wrong");
      }
    }
  );
  
export const UpdateSaheliProfile=createAsyncThunk(
    'saheli/updateProfile',
    async (data, {rejectWithValue,dispatch}) =>
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
