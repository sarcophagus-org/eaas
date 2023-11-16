import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./ui";
import { StoreProvider } from "./store/storeProvider";

function App() {
  return (
    <StoreProvider>
      <ChakraProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ChakraProvider>
    </StoreProvider>
  );
}

export default App;
