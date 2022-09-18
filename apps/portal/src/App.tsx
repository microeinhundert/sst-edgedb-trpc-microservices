import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Providers } from "./components/Providers";
import { Home } from "./routes/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;
