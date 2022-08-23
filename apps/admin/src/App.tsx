import { Route } from "react-router";
import { DataBrowserRouter } from "react-router-dom";

import { Providers } from "./components/Providers";
import { ConfirmForgotPassword } from "./routes/auth/ConfirmForgotPassword";
import { ConfirmSignUp } from "./routes/auth/ConfirmSignUp";
import { ForgotPassword } from "./routes/auth/ForgotPassword";
import { SignIn } from "./routes/auth/SignIn";
import { SignUp } from "./routes/auth/SignUp";
import { Home } from "./routes/Home";

function App() {
  return (
    <Providers>
      <DataBrowserRouter>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signIn" element={<SignIn />} />
        <Route path="/auth/signUp" element={<SignUp />} />
        <Route path="/auth/confirmSignUp" element={<ConfirmSignUp />} />
        <Route path="/auth/forgotPassword" element={<ForgotPassword />} />
        <Route path="/auth/confirmForgotPassword" element={<ConfirmForgotPassword />} />
      </DataBrowserRouter>
    </Providers>
  );
}

export default App;
