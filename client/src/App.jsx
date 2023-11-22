import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import UserAuth from './pages/UserAuth';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route path="signin" element={<UserAuth type="sign-in" />} />
        <Route path="signup" element={<UserAuth type="sign-up" />} />
      </Route>
    </Routes>
  );
};

export default App;
