import { withAuthenticator } from "@aws-amplify/ui-react";
import { Route } from "react-router";
import { DataBrowserRouter } from "react-router-dom";

import { Providers } from "./components/Providers";
import { Home } from "./routes/Home";

function App() {
  return (
    <Providers>
      <DataBrowserRouter>
        <Route path="/" element={<Home />} />
      </DataBrowserRouter>
    </Providers>
  );
}

export default withAuthenticator(App, {
  signUpAttributes: ["given_name", "family_name"],
});
