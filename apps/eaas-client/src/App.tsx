import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./ui";
import { StoreProvider } from "./store/storeProvider";
import { theme } from "ui/theme";
import { NetworkConfigProvider } from "ui/embalmer/NetworkConfigProvider";

function App() {
  return (
    <StoreProvider>
      <ChakraProvider theme={theme}>
        <NetworkConfigProvider>
          <Router>
            <AppRoutes />
          </Router>
        </NetworkConfigProvider>
      </ChakraProvider>
    </StoreProvider>
  );
}

export default App;
