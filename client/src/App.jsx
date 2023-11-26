import { Routes, Route } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';

import Navbar from './components/Navbar';
import UserAuth from './pages/UserAuth';
import { lookInSession } from './utils/sessions';
import Editor from './pages/Editor';

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState();

  useEffect(() => {
    const userInSession = lookInSession('user');

    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ access_token: null });
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/editor" element={<Editor />} />
        <Route path="/" element={<Navbar />}>
          <Route path="signin" element={<UserAuth type="sign-in" />} />
          <Route path="signup" element={<UserAuth type="sign-up" />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
