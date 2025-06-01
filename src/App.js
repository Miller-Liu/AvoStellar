import Main from './pages/Main';
import Signup from './pages/Signup';
import Login from './pages/Login';
import './App.css';

import { Route, Routes} from "react-router-dom";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/" element={<Main/>}></Route>
        <Route path="/login" element={<Login/> }></Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
