import { useContext, useState } from 'react';
import axios from 'axios';

import { getDay } from '../utils/date';
import { UserContext } from '../App';
import toast from 'react-hot-toast';
import CommentField from './CommentField';
import { BlogContext } from '../pages/Blog';

const CommentCard = ({ index, leftValue, commentData }) => {
  const {
    commented_by: {
      personal_info: { fullname, username: commentedUser, profile_img },
    },
    commentedAt,
    comment,
    _id,
    children,
  } = commentData;

  const [isReplying, setIsReplying] = useState(false);

  const {
    userAuth: { access_token, username },
  } = useContext(UserContext);

  const {
    blog,
    blog: {
      comments,
      comments: { results: commentsArr },
      activity,
      activity: { total_parent_comments },
      author: {
        personal_info: { username: blogAuthor },
      },
    },
    setBlog,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  const handleReply = () => {
    if (!access_token) {
      return toast.error('login first to leave a reply');
    }

    setIsReplying((preVal) => !preVal);
  };

  const getParentIndex = () => {
    let startingPoint = index - 1;

    try {
      while (
        commentsArr[startingPoint].childrenLevel >= commentData.childrenLevel
      ) {
        startingPoint--;
      }
    } catch {
      startingPoint = undefined;
    }

    return startingPoint;
  };

  const removeCommentsCards = (startingPoint, isDelete = false) => {
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

    if (isDelete) {
      let parentIndex = getParentIndex();

      if (parentIndex !== undefined) {
        commentsArr[parentIndex].children = commentsArr[
          parentIndex
        ].children.filter((child) => child !== _id);

        if (!commentsArr[parentIndex].children.length) {
          commentsArr[parentIndex].isReplyLoaded = false;
        }
      }

      commentsArr.splice(index, 1);
    }

    if (commentData.childrenLevel === 0 && isDelete) {
      setTotalParentCommentsLoaded((preVal) => preVal - 1);
    }

    setBlog({
      ...blog,
      comments: { results: commentsArr },
      activity: {
        ...activity,
        total_parent_comments:
          total_parent_comments -
          (commentData.childrenLevel === 0 && isDelete ? 1 : 0),
      },
    });
  };

  const hideReplies = () => {
    commentData.isReplyLoaded = false;

    removeCommentsCards(index + 1);
  };

  const loadReplies = async ({ skip = 0, currentIndex = index }) => {
    if (commentsArr[currentIndex].children.length) {
      hideReplies();

      try {
        const {
          data: { replies },
        } = await axios.post(
          import.meta.env.VITE_SERVER_DOMAIN + '/get-replies',
          {
            _id: commentsArr[currentIndex]._id,
            skip,
          }
        );

        commentsArr[currentIndex].isReplyLoaded = true;

        for (let i = 0; i < replies.length; i++) {
          replies[i].childrenLevel =
            commentsArr[currentIndex].childrenLevel + 1;

          commentsArr.splice(currentIndex + 1 + i + skip, 0, replies[i]);
        }

        setBlog({ ...blog, comments: { ...comments, results: commentsArr } });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteComment = async (e) => {
    e.target.setAttribute('disabled', true);

    try {
      const { data } = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + '/delete-comment',
        { _id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      e.target.removeAttribute('disabled', false);
      removeCommentsCards(index + 1, true);
    } catch (error) {
      console.log(error);
    }
  };

  const LoadMoreRepliesButton = () => {
    const parentIndex = getParentIndex();

    const button = (
      <button
        onClick={() =>
          loadReplies({
            skip: index - parentIndex,
            currentIndex: parentIndex,
          })
        }
        className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
      >
        Load more replies
      </button>
    );

    if (commentsArr[index + 1]) {
      if (
        commentsArr[index + 1].childrenLevel < commentsArr[index].childrenLevel
      ) {
        if (index - parentIndex < commentsArr[parentIndex].children.length) {
          return button;
        }
      }
    } else {
      if (parentIndex) {
        if (index - parentIndex < commentsArr[parentIndex].children.length) {
          return button;
        }
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
            {fullname} @{commentedUser}
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

          {username === commentedUser || username === blogAuthor ? (
            <button
              onClick={deleteComment}
              className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center"
            >
              <i className="fi fi-rr-trash pointer-events-none"></i>
            </button>
          ) : (
            ''
          )}
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

      <LoadMoreRepliesButton />
    </div>
  );
};

export default CommentCard;
