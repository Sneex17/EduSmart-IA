
import "./App.css";
import "antd/dist/antd.css"
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
