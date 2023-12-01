import axios from 'axios';
import { useEffect, useState } from 'react';

import InpageNavigation, { activeTabRef } from '../components/InpageNavigation';
import AnimationWrapper from '../utils/animation';
import { Loader } from '../components/Loader';
import BlogPostCard from '../components/BlogPostCard';
import MinimalBlogPost from '../components/MinimalBlogPost';

const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [pageState, setPageState] = useState('home');

  const categories = [
    'programming',
    'hollywood',
    'film making',
    'social media',
    'cooking',
    'technology',
    'finances',
    'travel',
  ];

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

  const loadBlogByCategory = (e) => {
    const category = e.target.innerText.toLowerCase();

    setBlogs(null);

    if (pageState === category) {
      setPageState('home');
      return;
    } else {
      setPageState(category);
    }
  };

  useEffect(() => {
    activeTabRef.current.click();

    if (pageState === 'home') {
      fetchLatestBlogs();
    }

    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* Latest blogs */}
        <div className="w-full">
          <InpageNavigation
            routes={[pageState, 'trending blogs']}
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

        {/* Filters and trending blogs */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories from all interest
              </h1>
              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => (
                  <button
                    onClick={loadBlogByCategory}
                    className={`tag ${
                      pageState === category && 'bg-black text-white'
                    }`}
                    key={i}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>
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
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
