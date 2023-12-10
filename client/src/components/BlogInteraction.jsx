import { useContext, useEffect } from 'react';
import { BlogContext } from '../pages/Blog';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

const BlogInteraction = () => {
  let {
    blog,
    blog: {
      _id,
      title,
      blog_id,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    isLikedByUser,
    setIsLikedByUser,
    setCommentsWrapper,
  } = useContext(BlogContext);

  const {
    userAuth: { username, access_token },
  } = useContext(UserContext);

  useEffect(() => {
    if (access_token) {
      // Make request to the server to get like information
      getLikeInfo();
    }
  }, []);

  const getLikeInfo = async () => {
    try {
      const {
        data: { result },
      } = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + '/isliked-by-user',
        { _id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      setIsLikedByUser(Boolean(result));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    try {
      if (access_token) {
        //like the blog
        setIsLikedByUser((prevValue) => !prevValue);

        !isLikedByUser ? total_likes++ : total_likes--;
        setBlog({ ...blog, activity: { ...activity, total_likes } });

        const {
          data: { likedByUser },
        } = await axios.post(
          import.meta.env.VITE_SERVER_DOMAIN + '/like-blog',
          { _id, isLikedByUser },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        console.log(likedByUser);
      } else {
        // not logged in
        toast.error('Please login to like this blog');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Toaster />
      <hr className="border-grey my-2" />
      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button
            onClick={handleLike}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isLikedByUser && 'bg-red/20 text-red'
            } bg-grey/80`}
          >
            <i className={`fi fi-${isLikedByUser ? 'sr' : 'rr'}-heart`}></i>
          </button>
          <p className="text-xl text-dark-grey">{total_likes}</p>

          <button
            onClick={() => setCommentsWrapper((prevValue) => !prevValue)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
          >
            <i className="fi fi-rr-comment-dots"></i>
          </button>
          <p className="text-xl text-dark-grey">{total_comments}</p>
        </div>

        <div className="flex gap-6 items-center">
          {username === author_username && (
            <Link
              to={`/editor/${blog_id}`}
              className="underline text-xl hover:text-purple"
            >
              Edit
            </Link>
          )}

          <Link
            to={`https://x.com/intent/tweet?text=Read ${title}&url=${location.href}`}
          >
            <i className="fi fi-brands-twitter-alt text-xl hover:text-twitter"></i>
          </Link>
        </div>
      </div>
      <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;
