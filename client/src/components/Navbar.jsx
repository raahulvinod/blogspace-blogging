import { useContext, useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { IoSearchOutline } from 'react-icons/io5';
import axios from 'axios';

import darkLogo from '../images/blog.png';
import lightLogo from '../images/logowhite.png';
import { ThemeContext, UserContext } from '../App';
import UserNavigation from './UserNavigation';
import { removeFromSession, storeInSession } from '../utils/sessions';

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);

  const { userAuth = {}, setUserAuth } = useContext(UserContext);
  const { access_token, profile_img, username, new_notification_available } =
    userAuth;

  const { theme, setTheme } = useContext(ThemeContext);

  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      if (access_token) {
        const { data } = await axios.get(
          import.meta.env.VITE_SERVER_DOMAIN + '/new-notification',
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setUserAuth({ ...userAuth, ...data });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (access_token) {
      fetchNotifications();
    }
  }, [access_token]);

  const signOutUser = () => {
    removeFromSession('user');
    setUserAuth({ access_token: null });
  };

  const handleSearch = (e) => {
    let query = e.target.value;

    if (e.keyCode === 13 && query.length) {
      navigate(`/search/${query}`);
    }
  };

  const changeTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    document.body.setAttribute('data-theme', newTheme);

    storeInSession('theme', newTheme);
  };

  return (
    <>
      <nav className="navbar z-50">
        <Link to="/" className="flex-none w-12">
          <img
            src={theme === 'light' ? darkLogo : lightLogo}
            alt="logo"
            className="w-full"
          />
        </Link>

        <div
          className={`absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ${
            searchBoxVisibility ? 'show' : 'hide'
          }`}
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
            onKeyDown={handleSearch}
          />
          <IoSearchOutline className="absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-2xl text-dark-grey" />
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button
            onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)}
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
          >
            <IoSearchOutline className="text-xl" />
          </button>

          <Link to="/editor" className="hidden md:flex items-center gap-2 link">
            <i className="fi fi-rr-file-edit"></i>
            <p>Write</p>
          </Link>

          <button
            onClick={changeTheme}
            className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10"
          >
            <i
              className={`fi fi-rr-${
                theme === 'light' ? 'moon-stars' : 'sun'
              } text-2xl block mt-1`}
            ></i>
          </button>

          {access_token ? (
            <>
              <Link to="/dashboard/notifications">
                <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                  <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                  {new_notification_available && (
                    <span className="w-3 h-3 bg-red rounded-full absolute z-10 top-2 right-2"></span>
                  )}
                </button>
              </Link>

              <div
                className="relative"
                onClick={() => setUserNavPanel((currentVal) => !currentVal)}
                onBlur={() =>
                  setTimeout(() => {
                    setUserNavPanel(false);
                  }, 200)
                }
              >
                <button className="w-12 h-12 mt-1">
                  <img
                    src={profile_img}
                    alt="profile"
                    className="w-full h-full object-cover rounded-full"
                  ></img>
                </button>
                {userNavPanel && (
                  <UserNavigation
                    username={username}
                    signOutUser={signOutUser}
                  />
                )}
              </div>
            </>
          ) : (
            <>
              <Link className="btn-dark py-2" to="/signin">
                Sign In
              </Link>
              <Link className="btn-light py-2 hidden md:block" to="/signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
