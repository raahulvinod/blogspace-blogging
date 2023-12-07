import { useParams } from 'react-router-dom';

const Blog = () => {
  const { blogId } = useParams();
  return <div>Blog {blogId}</div>;
};

export default Blog;
