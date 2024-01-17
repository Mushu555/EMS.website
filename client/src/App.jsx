
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './signup';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './Login'
import Home from './Home'
import Forgotpassword from './forgotpassword'
import ResetPassword from "./ResetPassword"
import SignUpPage from './signup2';
import SignUppage from './signup3';



function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<Signup />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/forgotpassword' element={<Forgotpassword />}></Route>
          <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
          <Route path='/register2' element={<SignUpPage />}></Route>
          <Route path='/register3' element={<SignUppage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

