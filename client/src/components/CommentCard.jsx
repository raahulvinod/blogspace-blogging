import { useContext, useState } from 'react';
import { getDay } from '../utils/date';
import { UserContext } from '../App';
import toast from 'react-hot-toast';
import CommentField from './CommentField';
import { BlogContext } from '../pages/Blog';
import axios from 'axios';

const CommentCard = ({ index, leftValue, commentData }) => {
  const {
    commented_by: {
      personal_info: { fullname, username, profile_img },
    },
    commentedAt,
    comment,
    _id,
    children,
  } = commentData;

  const [isReplying, setIsReplying] = useState(false);

  const {
    userAuth: { access_token },
  } = useContext(UserContext);

  const {
    blog,
    blog: {
      comments,
      comments: { results: commentsArr },
    },
    setBlog,
  } = useContext(BlogContext);

  const handleReply = () => {
    if (!access_token) {
      return toast.error('login first to leave a reply');
    }

    setIsReplying((preVal) => !preVal);
  };

  const removeCommentsCards = (startingPoint) => {
    if (commentsArr[startingPoint]) {
      while (
        commentsArr[startingPoint].childrenLevel > commentData.childrenLevel
      ) {
        commentsArr.splice(startingPoint, 1);

        if (!commentsArr[startingPoint]) {
          break;
        }
      }
    }

    setBlog({ ...blog, comments: { results: commentsArr } });
  };

  const hideReplies = () => {
    commentData.isReplyLoaded = false;

    removeCommentsCards(index + 1);
  };

  const loadReplies = async ({ skip = 0 }) => {
    if (children.length) {
      hideReplies();

      try {
        const {
          data: { replies },
        } = await axios.post(
          import.meta.env.VITE_SERVER_DOMAIN + '/get-replies',
          {
            _id,
            skip,
          }
        );

        commentData.isReplyLoaded = true;

        for (let i = 0; i < replies.length; i++) {
          replies[i].childrenLevel = commentData.childrenLevel + 1;

          commentsArr.splice(index + 1 + i + skip, 0, replies[i]);
        }

        setBlog({ ...blog, comments: { ...comments, results: commentsArr } });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="w-full" style={{ paddingLeft: `${leftValue * 10}px` }}>
      <div className="my-5 p-6 rounded-md border border-grey">
        <div className="flex gap-3 items-center mb-8">
          <img
            src={profile_img}
            alt="profile"
            className="w-6 h-6 rounded-full"
          />
          <p className="line-clamp-1">
            {fullname} @{username}
          </p>
          <p className="min-w-fit">{getDay(commentedAt)}</p>
        </div>
        <p className="font-gelasio text-xl ml-3">{comment}</p>

        <div className="flex gap-5 mt-5 items-center">
          {commentData.isReplyLoaded ? (
            <button
              onClick={hideReplies}
              className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
            >
              <i className="fi fi-rs-comment-dots"></i> Hide Reply
            </button>
          ) : (
            <button
              onClick={loadReplies}
              className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
            >
              <i className="fi fi-rs-comment-dots"></i> {children.length} Reply
            </button>
          )}
          <button onClick={handleReply} className="underline">
            Reply
          </button>
        </div>

        {isReplying ? (
          <div className="mt-8">
            <CommentField
              action="reply"
              index={index}
              replyingTo={_id}
              setIsReplying={setIsReplying}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default CommentCard;
