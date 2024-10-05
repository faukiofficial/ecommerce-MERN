import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  provinces: [],
  cities: [],
  isLoading: true,
  error: null,
};

// Async thunk for fetching provinces
export const fetchProvinces = createAsyncThunk(
  "location/fetchProvinces",
  async () => {
    const response = await axios.get("/api/starter/province", {
      headers: {
        key: import.meta.env.VITE_RAJAONGKIR_KEY, // Access the API key from .env.local
      },
    });
    console.log("Province request:", response);
    return response.data.rajaongkir.results; // Return the provinces data
  }
);

// Async thunk for fetching cities based on province
export const fetchCities = createAsyncThunk(
  "location/fetchCities",
  async (provinceId) => {
    const response = await axios.get("/api/starter/city", {
      params: { province: provinceId }, // Pass the province ID as a query parameter
      headers: {
        key: import.meta.env.VITE_RAJAONGKIR_KEY, // Access the API key from .env.local
      },
    });
    console.log('kota dari slice',response.data.rajaongkir.results);
    
    return response.data.rajaongkir.results; // Return the cities data
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation : (state, action) => {}
  },
  extraReducers: (builder) => {
    // Handle fetching provinces
    builder
      .addCase(fetchProvinces.pending, (state) => {
        state.isLoading = true; // Set loading to true when the request starts
        state.error = null; // Reset error state
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        console.log('ini dia',action.payload);
        state.isLoading = false; // Set loading to false when the request is successful
        state.provinces = action.payload; // Store the provinces in state
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.isLoading = false; // Set loading to false when the request fails
        state.error = action.error.message; // Store the error message
      });

    // Handle fetching cities
    builder
      .addCase(fetchCities.pending, (state) => {
        state.isLoading = true; // Set loading to true when the request starts
        state.error = null; // Reset error state
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.isLoading = false; // Set loading to false when the request is successful
        state.cities = action.payload; // Store the cities in state
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.isLoading = false; // Set loading to false when the request fails
        state.error = action.error.message; // Store the error message
      });
  },
});

export const {setLocation} = locationSlice.actions;

// Export the async thunks for use in components
export default locationSlice.reducer;
