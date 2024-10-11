import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial State
const initialState = {
  items: [], // List of items in cart
  selectedItems: {}, // Items selected for checkout
  total: 0, // Total price for checkout
  isCheckoutLoading: false, // Loading state for checkout
  orders: [], // List of all orders (admin)
  userOrders: [], // List of user-specific orders
  isLoadingOrders: false, // Loading state for fetching orders
  errorMessage: "", // Error messages for both checkout and orders
  successMessage: "", // Success message for checkout
};

// Async Thunk for checking out selected items
export const checkout = createAsyncThunk(
  "/order/checkout",
  async ({ orderData, token }) => {
    try {
      const response = await axios.post(
        "http://localhost:7500/api/order/checkout",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error di checkout slice", error);
      throw new Error(error.response?.data?.message || "Failed to checkout");
    }
  }
);

// Async Thunk for get all orders
export const getAllOrders = createAsyncThunk(
  "/order/getAllOrders",
  async ({ token, page = 1, limit = 10 }) => {
    try {
      const response = await axios.get("http://localhost:7500/api/order/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { page, limit },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.log("Error di getAllOrders slice", error);
      throw new Error(
        error.response?.data?.message || "Failed to get all orders"
      );
    }
  }
);

// Async Thunk for get user orders
export const getUserOrders = createAsyncThunk(
  "/order/getUserOrders",
  async ({ token, page = 1, limit = 10 }) => {
    try {
      const response = await axios.get(
        "http://localhost:7500/api/order/user-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { page, limit },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error di getUserOrders slice", error);
      throw new Error(
        error.response?.data?.message || "Failed to get user orders"
      );
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setOrder: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkout.pending, (state) => {
        state.isCheckoutLoading = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.isCheckoutLoading = false;
        state.successMessage = action.payload.message || "Checkout successful!";
        state.items = []; // Clear the cart on successful checkout
      })
      .addCase(checkout.rejected, (state, action) => {
        state.isCheckoutLoading = false;
        state.errorMessage = action.error.message || "Failed to checkout.";
      })
      .addCase(getAllOrders.pending, (state) => {
        state.isLoadingOrders = true;
        state.errorMessage = "";
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoadingOrders = false;
        state.orders = action.payload.orders || [];
        state.totalOrders = action.payload.totalOrders || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoadingOrders = false;
        state.errorMessage =
          action.error.message || "Failed to get all orders.";
      })
      .addCase(getUserOrders.pending, (state) => {
        state.isLoadingOrders = true;
        state.errorMessage = "";
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoadingOrders = false;
        state.userOrders = action.payload.userOrders || [];
        state.totalUserOrders = action.payload.totalUserOrders || 0;
        state.totalUserPages = action.payload.totalPages || 0;
        state.currentUserPage = action.payload.currentPage || 1;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoadingOrders = false;
        state.errorMessage =
          action.error.message || "Failed to get user orders.";
      });
  },
});

export const { setOrder } = checkoutSlice.actions;

export default checkoutSlice.reducer;
