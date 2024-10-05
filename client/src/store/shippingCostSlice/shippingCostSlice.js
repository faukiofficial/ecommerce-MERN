import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state for the shipping cost slice
const initialState = {
  costs: [],
  isLoading: true,
  error: null,
};

// Async thunk for fetching shipping costs
export const fetchShippingCosts = createAsyncThunk(
  "shipping/fetchShippingCosts",
  async ({ origin, destination, weight, courier }) => {
    const response = await axios.post(
      "/api/starter/cost",
      new URLSearchParams({
        origin,
        destination,
        weight,
        courier,
      }),
      {
        headers: {
          key: import.meta.env.VITE_RAJAONGKIR_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.rajaongkir.results; // Return the shipping costs data
  }
);

const shippingCostSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    resetShippingState: (state) => {
      state.costs = [];
      state.isLoading = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetching shipping costs
    builder
      .addCase(fetchShippingCosts.pending, (state) => {
        state.isLoading = true; // Set loading to true when the request starts
        state.error = null; // Reset error state
      })
      .addCase(fetchShippingCosts.fulfilled, (state, action) => {
        state.isLoading = false;
        // Accumulate costs from all couriers
        state.costs = [...state.costs, ...action.payload]; // Append new costs to existing ones
      })
      .addCase(fetchShippingCosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message; // Store the error message
      });
  },
});

export const { resetShippingState } = shippingCostSlice.actions;
export default shippingCostSlice.reducer;
