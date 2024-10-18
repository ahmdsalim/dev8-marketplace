import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Auth /> },
    { path: "/register", element: <Auth /> },
    // { path: "/", element: <Navigate to="/login" /> },
    // { path: "*", element: <NotFoundPage /> },
  ]);
  return (
    <>
      {/* <Toaster /> */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
