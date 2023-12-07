import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AnimationWrapper from '../utils/animation';
import { Loader } from '../components/Loader';
import { getDay } from '../utils/date';
import BlogInteraction from '../components/BlogInteraction';

export const blogStructure = {
  title: '',
  des: '',
  content: [],
  tags: [],
  author: { personal_info: {} },
  banner: '',
  publishedAt: '',
};

const Blog = () => {
  const { blogId } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [loading, setLoading] = useState(true);

  const {
    title,
    content,
    banner,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    publishedAt,
  } = blog;

  const fetchBlog = async () => {
    try {
      const {
        data: { blog },
      } = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/get-blog', {
        blogId,
      });

      setBlog(blog);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  console.log(blog);

  useEffect(() => {
    fetchBlog();
  }, []);

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-[900px] center py-10 max-lg:px-5vw">
          <img src={banner} className="aspect-video" />

          <div className="mt-12">
            <h2>{title}</h2>

            <div className="flex max-sm:flex-col justify-between my-8">
              <div className="flex gap-5 items-start">
                <img src={profile_img} className="w-12 h-12 rounded-full" />
                <p className="capitalize">
                  {fullname} <br />@
                  <Link to={`/user/${author_username}`} className="underline">
                    {author_username}
                  </Link>
                </p>
              </div>
              <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                Published on {getDay(publishedAt)}
              </p>
            </div>

            <BlogInteraction />
          </div>
        </div>
      )}
    </AnimationWrapper>
  );
};

export default Blog;
