import "./App.css";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { Toaster } from "react-hot-toast";
import { Layout } from "./components/Layout";
import { isAuthenticated } from "./utils/AuthHelpers";
import { Profile } from "./pages/Profile";

function App() {
  return (
    <Router>
      <Toaster />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={isAuthenticated() ? <Navigate to="/profile" /> : <Auth />}
          />
          <Route
            path="/register"
            element={isAuthenticated() ? <Navigate to="/profile" /> : <Auth />}
          />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
