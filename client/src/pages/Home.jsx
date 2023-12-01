import axios from 'axios';
import { useEffect, useState } from 'react';

import InpageNavigation from '../components/InpageNavigation';
import AnimationWrapper from '../utils/animation';
import { Loader } from '../components/Loader';
import BlogPostCard from '../components/BlogPostCard';
import MinimalBlogPost from '../components/MinimalBlogPost';

const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);

  const fetchLatestBlogs = async () => {
    const {
      data: { blogs },
    } = await axios.get(import.meta.env.VITE_SERVER_DOMAIN + '/latest-blogs');

    setBlogs(blogs);
  };

  const fetchTrendingBlogs = async () => {
    const {
      data: { blogs },
    } = await axios.get(import.meta.env.VITE_SERVER_DOMAIN + '/trending-blogs');

    setTrendingBlogs(blogs);
  };
  console.log(trendingBlogs);

  useEffect(() => {
    fetchLatestBlogs();
    fetchTrendingBlogs();
  }, []);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* Latest blogs */}
        <div className="w-full">
          <InpageNavigation
            routes={['home', 'trending blogs']}
            defaultHidden={['trending blogs']}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : (
                blogs.map((blog, i) => (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <BlogPostCard
                      content={blog}
                      author={blog.author.personal_info}
                    />
                  </AnimationWrapper>
                ))
              )}
            </>

            {/* Filters and trending blogs */}
            {trendingBlogs == null ? (
              <Loader />
            ) : (
              trendingBlogs.map((blog, i) => (
                <AnimationWrapper
                  transition={{ duration: 1, delay: i * 0.1 }}
                  key={i}
                >
                  <MinimalBlogPost blog={blog} index={i} />
                </AnimationWrapper>
              ))
            )}
          </InpageNavigation>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
