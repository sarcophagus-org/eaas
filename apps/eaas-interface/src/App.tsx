import { ChakraProvider } from "@chakra-ui/react";
import { AppRoutes } from "./ui";
import { StoreProvider } from "./store/storeProvider";

function App() {
  return (
    <StoreProvider>
      <ChakraProvider>
        <AppRoutes />
      </ChakraProvider>
    </StoreProvider>
  );
}

export default App;
