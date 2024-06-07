import Main from './pages/Main';
import Signup from './pages/Signup';
import Login from './pages/Login';
import './App.css';

import { Route, Routes} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/main" element={<Main/>}></Route>
        <Route path="/login" element={<Login/> }></Route>
      </Routes>
    </div>
  );
}

export default App;
