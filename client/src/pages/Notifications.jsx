import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../App';
import { filterPagination } from '../utils/filterPagination';
import { Loader } from '../components/Loader';
import AnimationWrapper from '../utils/animation';
import NoData from '../components/NoData';
import NotificationCard from '../components/NotificationCard';
import LoadMoreButton from '../components/LoadMoreButton';

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(null);

  const {
    userAuth,
    userAuth: { access_token, new_notification_available } = {},
    setUserAuth,
  } = useContext(UserContext);

  let filters = ['all', 'like', 'comment', 'reply'];

  const fetchNotifications = async ({ page, deleteDocCount = 0 }) => {
    try {
      const {
        data: { notifications: data },
      } = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + '/notifications',
        { page, filter, deleteDocCount },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (new_notification_available)
        setUserAuth({ ...userAuth, new_notification_available: false });

      const formatedData = await filterPagination({
        state: notifications,
        data,
        page,
        countRoute: '/all-notification-count',
        data_to_send: { filter },
        user: access_token,
      });

      setNotifications(formatedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (access_token) fetchNotifications({ page: 1 });
  }, [access_token, filter]);

  const handleFilter = (e) => {
    const button = e.target;

    setFilter(button.innerHTML);
    setNotifications(null);
  };

  return (
    <div>
      <h1 className="max-md:hidden">Recent Notifications</h1>

      <div className="my-8 flex gap-6">
        {filters.map((filterName, i) => {
          return (
            <button
              key={i}
              className={`py-2 ${
                filter === filterName ? 'btn-dark' : 'btn-light'
              }`}
              onClick={handleFilter}
            >
              {filterName}
            </button>
          );
        })}
      </div>
      {notifications == null ? (
        <Loader />
      ) : (
        <>
          {notifications.results.length ? (
            notifications.results.map((notification, i) => {
              return (
                <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
                  <NotificationCard
                    data={notification}
                    index={i}
                    notificationState={{ notifications, setNotifications }}
                  />
                </AnimationWrapper>
              );
            })
          ) : (
            <NoData message="Nothing available" />
          )}

          <LoadMoreButton
            state={notifications}
            fetchData={fetchNotifications}
            additionalParam={{ deletedDocCount: notifications.deletedDocCount }}
          />
        </>
      )}
    </div>
  );
};

export default Notifications;
