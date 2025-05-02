import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar';
import Home from './pages/Home';

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <SideBar />
        <div style={{ flex: 1, padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Add more routes here */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;