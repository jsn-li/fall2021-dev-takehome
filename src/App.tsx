import TodoList from "./components/TodoList";
import { Center, ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <Center>
        <TodoList />
      </Center>
    </ChakraProvider>
  );
}

export default App;
