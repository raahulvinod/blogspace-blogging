import { useContext, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import axios from 'axios';

import { UserContext } from '../App';

export const NotificationCommentField = ({
  _id,
  blog_author,
  index = undefined,
  replyingTo = undefined,
  setReplying,
  notification_id,
  notificationData,
}) => {
  const [comment, setComment] = useState('');

  const { _id: user_id } = blog_author;
  const {
    userAuth: { access_token },
  } = useContext(UserContext);
  const {
    notifications,
    notifications: { results },
    setNotifications,
  } = notificationData;

  const handleComment = async () => {
    if (!access_token) {
      return toast.error('Login first to leave a comment');
    }

    if (!comment.length) {
      return toast.error('Write something to leave a comment');
    }

    try {
      const { data } = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + '/add-comment',
        {
          _id,
          comment,
          blog_author: user_id,
          replying_to: replyingTo,
          notification_id,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      setReplying(false);
      results[index].reply = { comment, _id: data._id };
      setNotifications({ ...notifications, results });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a reply..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      ></textarea>
      <button className="btn-dark mt-5 px-10" onClick={handleComment}>
        reply
      </button>
    </>
  );
};
