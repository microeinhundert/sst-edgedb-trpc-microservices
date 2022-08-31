import { Route } from "react-router";
import { DataBrowserRouter } from "react-router-dom";

import { Providers } from "./components/Providers";
import { Home } from "./routes/Home";

function App() {
  return (
    <Providers>
      <DataBrowserRouter>
        <Route element={<Home />} path="/" />
      </DataBrowserRouter>
    </Providers>
  );
}

export default App;
