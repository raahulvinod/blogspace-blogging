import { useContext } from 'react';
import { BlogContext } from '../pages/Blog';
import CommentField from './CommentField';
import NoData from './NoData';
import AnimationWrapper from '../utils/animation';
import CommentCard from './CommentCard';
import { Loader } from './Loader';

const CommentsContainer = () => {
  const {
    blog: {
      title,
      comments: { results: commentsArr },
      activity: { total_parent_comments },
    },
    commentsWrapper,
    setCommentsWrapper,
    totalParentCommentsLoaded,
  } = useContext(BlogContext);

  return (
    <div
      className={`max-sm:w-full fixed duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden ${
        commentsWrapper ? 'top-0 sm:right-0' : 'top-[100%] sm:right-[-100%]'
      }`}
    >
      <div className="relative">
        <h1 className="text-xl font-medium">Comments</h1>
        <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">
          {title}
        </p>
        <button
          onClick={() => setCommentsWrapper((prevVal) => !prevVal)}
          className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey"
        >
          <i className="fi fi-br-cross text-2xl mt-1"></i>
        </button>
      </div>
      <hr className="border-grey my-8 w-[120%] -ml-10" />

      <CommentField action="comment" />

      {commentsArr && commentsArr.length ? (
        commentsArr.map((comment, i) => {
          return (
            <AnimationWrapper key={i}>
              <CommentCard
                index={i}
                leftValue={comment.childrenLevel * 4}
                commentData={comment}
              />
            </AnimationWrapper>
          );
        })
      ) : (
        <NoData message="No comments" />
      )}

      {total_parent_comments > totalParentCommentsLoaded ? (
        <button>Load more</button>
      ) : (
        ''
      )}
    </div>
  );
};

export default CommentsContainer;
