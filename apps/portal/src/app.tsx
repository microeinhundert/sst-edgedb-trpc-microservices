import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Providers } from "./components/providers";
import { Home } from "./routes/home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

export function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
