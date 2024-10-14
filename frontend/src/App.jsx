import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Home } from "./pages/Home";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
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
