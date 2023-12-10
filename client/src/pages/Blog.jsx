import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import AnimationWrapper from '../utils/animation';
import { Loader } from '../components/Loader';
import { getDay } from '../utils/date';
import BlogInteraction from '../components/BlogInteraction';
import BlogPostCard from '../components/BlogPostCard';
import BlogContent from '../components/Blogcontent';
import CommentsContainer from '../components/CommentsContainer';

export const blogStructure = {
  title: '',
  des: '',
  content: [],
  author: { personal_info: {} },
  banner: '',
  publishedAt: '',
};

export const BlogContext = createContext({});

const Blog = () => {
  const { blogId } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [commentsWrapper, setCommentsWrapper] = useState(false);
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

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

      if (blog.tags && blog.tags.length > 0) {
        const { data } = await axios.post(
          import.meta.env.VITE_SERVER_DOMAIN + '/search-blogs',
          {
            tag: blog.tags[0],
            limit: 6,
            eliminateBlog: blogId,
          }
        );

        setSimilarBlogs(data.blogs);
      }

      setLoading(false);
    } catch (error) {
      console.log('Error fetching blog:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    resetState();
    fetchBlog();
  }, [blogId]);

  const resetState = () => {
    setBlog(blogStructure);
    setSimilarBlogs(null);
    setLoading(true);
    setIsLikedByUser(false);
    setCommentsWrapper(false);
    setTotalParentCommentsLoaded(0);
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <BlogContext.Provider
          value={{
            blog,
            setBlog,
            isLikedByUser,
            setIsLikedByUser,
            commentsWrapper,
            setCommentsWrapper,
            totalParentCommentsLoaded,
            setTotalParentCommentsLoaded,
          }}
        >
          <CommentsContainer />

          <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
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

              {/* Blog content */}
              <div className="my-12 font-gelasio blog-page-content">
                {content[0].blocks.map((block, i) => {
                  return (
                    <div key={i} className="my-4 md:my-8">
                      <BlogContent block={block} />
                    </div>
                  );
                })}
              </div>

              <BlogInteraction />

              {similarBlogs !== null && similarBlogs.length ? (
                <>
                  <h1 className="text-2xl mt-14 mb-10 font-medium">
                    Similar blogs
                  </h1>
                  {similarBlogs.map((blog, i) => {
                    const {
                      author: { personal_info },
                    } = blog;

                    return (
                      <AnimationWrapper
                        key={i}
                        transition={{ duration: 1, delay: i * 0.08 }}
                      >
                        <BlogPostCard content={blog} author={personal_info} />
                      </AnimationWrapper>
                    );
                  })}
                </>
              ) : (
                ''
              )}
            </div>
          </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default Blog;
