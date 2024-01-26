import { Routes, Route } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';

import Navbar from './components/Navbar';
import UserAuth from './pages/UserAuth';
import { lookInSession } from './utils/sessions';
import Editor from './pages/Editor';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import PageNotFound from './pages/404Page';
import UserProfile from './pages/UserProfile';
import Blog from './pages/Blog';
import SideNav from './components/SideNav';
import ChangePassword from './components/ChangePassword';
import EditProfile from './components/EditProfile';
import Notifications from './pages/Notifications';
import BlogManagement from './pages/ManageBlogs';

export const UserContext = createContext({});

export const ThemeContext = createContext({});

const darkThemePreference = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const App = () => {
  const [userAuth, setUserAuth] = useState();
  const [theme, setTheme] = useState(() => {
    darkThemePreference() ? 'dark' : 'light';
  });

  useEffect(() => {
    const userInSession = lookInSession('user');
    const themeInSession = lookInSession('theme');

    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ access_token: null });

    if (themeInSession) {
      setTheme(() => {
        document.body.setAttribute('data-theme', themeInSession);

        return themeInSession;
      });
    } else {
      document.body.setAttribute('data-theme', theme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ userAuth, setUserAuth }}>
        <Routes>
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:blogId" element={<Editor />} />
          <Route path="/" element={<Navbar />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<SideNav />}>
              <Route path="notifications" element={<Notifications />} />
              <Route path="blogs" element={<BlogManagement />} />
            </Route>
            <Route path="settings" element={<SideNav />}>
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
            <Route path="signin" element={<UserAuth type="sign-in" />} />
            <Route path="signup" element={<UserAuth type="sign-up" />} />
            <Route path="search/:query" element={<SearchPage />} />
            <Route path="user/:id" element={<UserProfile />} />
            <Route path="/blog/:blogId" element={<Blog />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
