import { ChakraProvider } from "@chakra-ui/react";
import { AppRoutes } from "./ui";

function App() {
  return (
    <ChakraProvider>
      <AppRoutes />
    </ChakraProvider>
  );
}

export default App;
