import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial State
const initialState = {
  items: [],
  selectedItems: {},
  total: 0,
  isCheckoutLoading: false,
  errorMessage: "",
  successMessage: "",
};

// Async Thunk for checking out selected items
export const checkout = createAsyncThunk(
  "/cart/checkout",
  async ({ selectedItems, token }) => {
    try {
      // Convert selectedItems object to an array of product IDs
      const productIds = Object.keys(selectedItems).filter(
        (key) => selectedItems[key]
      );

      const response = await axios.post(
        "http://localhost:7500/api/checkout",
        { productIds }, // Send selected product IDs
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token
          },
          withCredentials: true, // Ensure credentials are sent with the request
        }
      );
      return response.data; // The order created
    } catch (error) {
      // Return the error object directly if needed
      throw new Error(error.response?.data?.message || "Failed to checkout");
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    toggleItemSelection: (state, action) => {
      const productId = action.payload;
      state.selectedItems[productId] = !state.selectedItems[productId];
    },
    setQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      state.items = state.items.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      );
    },
    calculateTotal: (state) => {
      const selectedItems = state.selectedItems;
      state.total = state.items.reduce((acc, item) => {
        if (selectedItems[item.product._id]) {
          return acc + item.product.salePrice * item.quantity;
        }
        return acc;
      }, 0);
    },
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
      });
  },
});

export const { toggleItemSelection, setQuantity, calculateTotal } =
checkoutSlice.actions;

export default checkoutSlice.reducer;
