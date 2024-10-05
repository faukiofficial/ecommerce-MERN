import { Route, Routes, Navigate } from "react-router-dom";
import ProductUpload from "./pages/Admin/ProductUpload ";
import ProductTable from "./pages/Admin/ProductTable";
import AdminLayout from "./components/Admin/Layout/AdminLayout";
import Orders from "./pages/Admin/Orders";
import StoreSetting from "./pages/Admin/StoreSetting";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import { AdminRoute, UserRoute, AuthRoute } from "./config/auth-check";
import AuthLayout from "./components/Auth/AuthLayout";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice/authSlice";
import ShopLayout from "./components/Shop/Layout/ShopLayout";
import ShoppingHome from "./pages/Shop/Home";
import Checkout from "./pages/Shop/Checkout";
import LocationForm from "./pages/LocationForm";
import EditProfile from "./pages/Shop/EditProfile";
import Address from "./pages/Shop/Address";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/shop/products" />} />
      <Route path="/shop" element={<Navigate to="/shop/products" />} />
      <Route path="/admin" element={<Navigate to="/admin/products" />} />
      <Route path="/shop" element={<ShopLayout />}>
        <Route path="products" element={<ShoppingHome />} />
        <Route path="checkout" element={<UserRoute><Checkout /></UserRoute>} />
        <Route path="my-profile" element={<UserRoute><EditProfile /></UserRoute>} />
        <Route path="my-address" element={<UserRoute><Address /></UserRoute>} />
      </Route>
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="products" element={<ProductTable />} />
        <Route path="add-product" element={<ProductUpload />} />
        <Route path="edit-product" element={<ProductUpload />} />
        <Route path="orders" element={<Orders />} />
        <Route path="store-setting" element={<StoreSetting />} />
      </Route>
      <Route path="/auth" element={<Navigate to="/auth/login" />} />
      <Route path="/location" element={<LocationForm/>} />
      <Route
        path="/auth"
        element={
          <AuthRoute>
            <AuthLayout />
          </AuthRoute>
        }
      >
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
