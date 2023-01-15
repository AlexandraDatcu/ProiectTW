import MainNavigation from "./components/MainNavigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <div className="App">
            <MainNavigation/>
        </div>
    </QueryClientProvider>
  );
}

export default App;
