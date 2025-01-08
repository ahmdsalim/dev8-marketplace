import "./App.css";
import "react-photo-view/dist/react-photo-view.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { Toaster } from "react-hot-toast";
import { Layout } from "./components/Layout";
// import { isAuthenticated } from "./helpers/AuthHelpers";
import { Profile } from "./pages/Profile";
import { Products } from "./pages/Products";
// import ProtectedRoute from "./components/ProtectedRoute";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Orders } from "./pages/Orders";
import { OrderDetails } from "./pages/OrderDetails";

import DashboardLayout from "./components/admin/DashboardLayout";
import Dashboard from "./pages/Admin/Dashboard";
import Users from "./pages/Admin/Users";
import Categories from "./pages/Admin/Categories";
import Collaborations from "./pages/Admin/Collaborations";
import Variants from "./pages/Admin/Variants";
import ProductList from "./pages/Admin/Products";
import OrderList from "./pages/Admin/Orders";
import RoleBasedRoute from "./components/RoleBasedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import GuestRoute from "./components/GuestRoute";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
          </Route>
        </Route>

        {/* Protected Routes */}
        <Route element={<AuthenticatedRoute />}>
          <Route element={<RoleBasedRoute allowedRoles={["user"]} showForbidden={true} />}>
            <Route element={<Layout />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order-detail/:id" element={<OrderDetails />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<AuthenticatedRoute />}>
          <Route element={<RoleBasedRoute allowedRoles={["admin"]} showForbidden={true} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/users" element={<Users />} />
              <Route path="/dashboard/categories" element={<Categories />} />
              <Route
                path="/dashboard/collaborations"
                element={<Collaborations />}
              />
              <Route path="/dashboard/variants" element={<Variants />} />
              <Route path="/dashboard/products" element={<ProductList />} />
              <Route path="/dashboard/orders" element={<OrderList />} />
            </Route>
          </Route>
        </Route>

        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
