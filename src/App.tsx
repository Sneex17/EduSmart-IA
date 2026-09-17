
import "./App.css";
import Login from "./pages/Login";
import MyRouter from "./routers/router";

function App() {
  return (
    <>
      <div className='flex p-5'>
        <MyRouter/>
      </div>
    </>
  );
}

export default App;
