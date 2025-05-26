import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Start_Page from './Page/Start_Page';
import Action_Page from './Page/Action_Page';
import Home_Page from './Page/Home_Page';

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route index element={<Home_Page/>}/>
        <Route path='/start' element={<Start_Page/>}/>
        <Route path='/action' element={<Action_Page/>}/>
        <Route path='/home' element={<Home_Page/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
    