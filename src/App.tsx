import { Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar';
import Home from './pages/Home';
import ProfileScreen from './pages/ProfileScreen';
import AddSkill from './pages/AddSkill';
import CategoryPage from './pages/CategoryPage';
import SkillDetails from './pages/SkillDetails';
import ChatList from './pages/ChatList';
import PendingMessages from './pages/PendingMessages';
import MySkillDetails from './pages/MySkillDetails';
import EditSkillPage from './pages/EditSkillPage';
import EditProflie from './pages/EditProfile';
import UserProfileScreen from './pages/UserProfileScreen';
import ChatMessages from './pages/ChatMessages';


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
          <Route path="/MySkill/:id" element={<MySkillDetails />} />
          <Route path="/EditSkill/:id" element={<EditSkillPage />} />
          <Route path="/ChatList" element={<ChatList />} />
          <Route path="/PendingMessages" element={<PendingMessages />} />
          <Route path="/EditProfile" element={<EditProflie />} />
          <Route path="/user/:email" element={<UserProfileScreen />} />
          <Route path="/chat/:chatId" element={<ChatMessages />} />


          {/* Add more routes here */}
        </Routes>
      </div>
    </div>

  );
};

export default App;
