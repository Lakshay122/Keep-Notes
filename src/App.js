import { BrowserRouter, Routes, Route, Switch } from 'react-router-dom';
import React from 'react';
import Sign from './Components/Authentication/Sign';
import Protected from './Components/Authentication/Protected';
import MainHead from './Components/DashBoard/MainHead';
import Loading from './Components/Authentication/Loading';
import SignUp from './Components/Authentication/SignUp';
import { Toaster } from 'react-hot-toast';
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/Sign' element={<Sign />} />
          <Route path='/SignUP' element={<SignUp />} />
          <Route path='/loading' element={<Loading />} />
          

          <Route path='*' element={<Protected Component={MainHead} />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>

  )
}
export default App;