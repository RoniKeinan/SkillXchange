import { Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar';
import Home from './pages/Home';
import ProfileScreen from './pages/ProfileScreen';
import AddSkill from './pages/AddSkill';
import CategoryPage from './pages/CategoryPage';
import SkillDetails from './pages/SkillDetails';
import ChatList from './pages/ChatList';
import PendingMessages from './pages/PendingMessages';

const App: React.FC = () => {
  return (

    <div style={{ display: 'flex' }}>
      <SideBar />
      <div style={{ flex: 1, padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ProfileScreen" element={<ProfileScreen />} />
          <Route path="/AddSkill" element={<AddSkill />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/skill/:id" element={<SkillDetails />} />
          <Route path="/ChatList" element={<ChatList />} />
          <Route path="/PendingMessages" element={<PendingMessages />} />



          {/* Add more routes here */}
        </Routes>
      </div>
    </div>

  );
};

export default App;
