import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./ui";
import { StoreProvider } from "./store/storeProvider";
import { WalletProvider } from "./ui/embalmer/WalletProvider";
import { theme } from "ui/theme";

function App() {
  return (
    <StoreProvider>
      <ChakraProvider theme={theme}>
        <WalletProvider>
          <Router>
            <AppRoutes />
          </Router>
        </WalletProvider>
      </ChakraProvider>
    </StoreProvider>
  );
}

export default App;
