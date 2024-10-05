import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice/authSlice'
import productReducer from './productSlice/productSlice'
import cartReducer from './cartSlice/cartSlice'
import checkoutReducer from './checkoutSlice/checkoutSlice'
import locationReducer from './locationSlice/locationSlice'
import shippingReducer from './shippingCostSlice/shippingCostSlice'
import addressReducer from './addressForm-slice/addressFormSlice'

const store = configureStore({
    reducer : {
        auth : authReducer,
        product : productReducer,
        cart : cartReducer,
        checkout : checkoutReducer,
        location : locationReducer,
        shipping : shippingReducer,
        address : addressReducer,
    }
})

export default store