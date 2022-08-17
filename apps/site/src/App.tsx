import { Route } from "react-router";
import { DataBrowserRouter } from "react-router-dom";

import { Providers } from "./components/Providers";
import { ConfirmSignUp } from "./routes/auth/ConfirmSignUp";
import { SignUp } from "./routes/auth/SignUp";
import { Home } from "./routes/Home";

function App() {
  return (
    <Providers>
      <DataBrowserRouter>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signUp" element={<SignUp />} />
        <Route path="/auth/confirmSignUp" element={<ConfirmSignUp />} />
      </DataBrowserRouter>
    </Providers>
  );
}

export default App;
