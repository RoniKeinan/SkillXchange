import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar';
import Home from './pages/Home';
import ProfileScreen from './pages/ProfileScreen';
import AddSkill from './pages/AddSkill';

const App: React.FC = () => {
  return (

    <div style={{ display: 'flex' }}>
      <SideBar />
      <div style={{ flex: 1, padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ProfileScreen" element={<ProfileScreen />} />
          <Route path="/AddSkill" element={<AddSkill/>} />

          {/* Add more routes here */}
        </Routes>
      </div>
    </div>

  );
};

export default App;
