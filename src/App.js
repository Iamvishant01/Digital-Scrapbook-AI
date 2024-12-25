import './App.css';
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/Loginpage';
import Navbar from './Components/Navbar';
import WelcomePage from './Components/WelcomePage';
function App() {
  const [count, setCount] = useState(0)
  return (
    <Router>
    <div className='App'>
    <Navbar/>
        <Routes>
          <Route path="/" element={ <LoginPage/> } />
          <Route path="/welcome" element={ <WelcomePage/> } />
        </Routes>
    </div>
    </Router>
  );
}

export default App;
