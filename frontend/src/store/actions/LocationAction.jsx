import axios from '../../api/ApiConfigure';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const Sos = createAsyncThunk(
  'sos/sendLocation',
  async (location, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/sos",
        location,
        {
          headers: {
            "Content-Type": "application/json", // ✅ fixed
          },
          withCredentials: true,
        }
      );
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);
