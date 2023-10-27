import { Button, ChakraProvider, Text, useToast } from "@chakra-ui/react";
import { testApi } from "./utils/api";

function App() {
  const toast = useToast();
  return (
    <ChakraProvider>
      <Text>Emabalmer-X</Text>
      <Button
        onClick={async () => {
          toast({
            title: await testApi(),
          });
        }}
      >
        <Text>test</Text>
      </Button>
    </ChakraProvider>
  );
}

export default App;
