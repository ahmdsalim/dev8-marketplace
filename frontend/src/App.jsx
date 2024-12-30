import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { Toaster } from "react-hot-toast";
import { Layout } from "./components/Layout";
// import { isAuthenticated } from "./helpers/AuthHelpers";
import { Profile } from "./pages/Profile";
import { Products } from "./pages/Products";
import ProtectedRoute from "./components/ProtectedRoute";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Orders } from "./pages/Orders";
import { OrderDetails } from "./pages/OrderDetails";

function App() {
  return (
    <Router>
      <Toaster />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order-detail/:id" element={<OrderDetails />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
