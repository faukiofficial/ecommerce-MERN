import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_ADDRESS_URL = import.meta.env.VITE_BACKEND_URL;

const CART_URL = API_ADDRESS_URL + "/api/cart";

// Initial State
const initialState = {
  cart: null,
  isLoading: false,
  isUpdating: false,
  isQuantityUpdateting: false,
  updatingItemId: null,
  isRemoving: false,
  removingItemId: null,
  errorMessage: "",
  successMessage: "",
};


// Async Thunks for Cart CRUD Operations

// Get user's cart
export const getCart = createAsyncThunk('/cart/getCart', async (token) => {
  const response = await axios.get(CART_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
});

// Add product to cart
export const addToCart = createAsyncThunk('/cart/addToCart', async ({ productId, quantity, token }) => {
  const response = await axios.post(
    `${CART_URL}/add`, 
    { productId, quantity }, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
  return response.data;
});

// Remove product from cart
export const removeFromCart = createAsyncThunk('/cart/removeFromCart', async ({ productId, token }) => {
  const response = await axios.post(
    `${CART_URL}/remove`, 
    { productId }, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
  return { data: response.data, productId };
});

// Update cart item quantity
export const updateCartItem = createAsyncThunk('/cart/updateCartItem', async ({ productId, quantity, token }) => {
  const response = await axios.post(
    `${CART_URL}/update`, 
    { productId, quantity }, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
  return { data: response.data, productId };
});

// Clear cart
export const clearCart = createAsyncThunk('/cart/clearCart', async (token) => {
  const response = await axios.post(`${CART_URL}/clear`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
});

// Cart Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.cart = null;
      state.isLoading = false;
      state.errorMessage = "";
      state.successMessage = "";
      state.updatingItemId = null;
      state.removingItemId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
      })
      .addCase(getCart.rejected, (state) => {
        state.isLoading = false;
        state.errorMessage = "Failed to get cart.";
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.cart = action.payload.cart;
        state.successMessage = action.payload.message;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isUpdating = false;
        state.errorMessage = "Failed to add to cart.";
      })

      // Remove from Cart
      .addCase(removeFromCart.pending, (state, action) => {
        state.isRemoving = true;
        state.removingItemId = action.meta.arg.productId;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isRemoving = false;
        state.removingItemId = null;
        state.cart = action.payload.data.cart;
        state.successMessage = action.payload.message;
      })
      .addCase(removeFromCart.rejected, (state) => {
        state.isRemoving = false;
        state.removingItemId = null;
        state.errorMessage = "Failed to remove from cart.";
      })

      // Update Cart Item
      .addCase(updateCartItem.pending, (state, action) => {
        state.isQuantityUpdateting = true;
        state.updatingItemId = action.meta.arg.productId;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isQuantityUpdateting = false;
        state.updatingItemId = null;
        state.cart = action.payload.data.cart;
        state.successMessage = action.payload.message;
      })
      .addCase(updateCartItem.rejected, (state) => {
        state.isQuantityUpdateting = false;
        state.updatingItemId = null;
        state.errorMessage = "Failed to update cart.";
      })

      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload.cart;
        state.successMessage = action.payload.message;
      })
      .addCase(clearCart.rejected, (state) => {
        state.isLoading = false;
        state.errorMessage = "Failed to clear cart.";
      });
  },
});

export const { resetCartState } = cartSlice.actions;

export default cartSlice.reducer;
