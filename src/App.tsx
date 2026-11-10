import "./App.css";
import { AuthProvider } from "./context/AuthProvider";
import MyRouter from "./routers/router";

function App() {
  return (
    <AuthProvider>
      <MyRouter />
    </AuthProvider>
  );
}

export default App;
