import { Link } from 'react-router-dom';
import { getDay } from '../utils/date';

const MinimalBlogPost = ({ blog, index }) => {
  const {
    title,
    blog_id: id,
    author: {
      personal_info: { fullname, username, profile_img },
    },
    publishedAt,
  } = blog;
  return (
    <Link to={`/blog/${id}`} className="flex gap-3 mb-8">
      <h1 className="blog-index">{index < 10 ? '0' + (index + 1) : index}</h1>
      <div>
        <div className="flex gap-2 items-center mb-7">
          <img
            src={profile_img}
            alt="profile"
            className="w-6 h-6 rounded-full"
          />
          <p className="line-clamp-1">
            {fullname} @{username}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>
        <p className="blog-title">{title}</p>
      </div>
    </Link>
  );
};

export default MinimalBlogPost;
