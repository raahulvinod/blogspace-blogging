import axios from 'axios';
import { useEffect, useState } from 'react';

import InpageNavigation, { activeTabRef } from '../components/InpageNavigation';
import AnimationWrapper from '../utils/animation';
import { Loader } from '../components/Loader';
import BlogPostCard from '../components/BlogPostCard';
import MinimalBlogPost from '../components/MinimalBlogPost';
import NoData from '../components/NoData';
import { filterPagination } from '../utils/filterPagination';
import LoadMoreButton from '../components/LoadMoreButton';

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

  const fetchLatestBlogs = async ({ page = 1 }) => {
    const { data } = await axios.post(
      import.meta.env.VITE_SERVER_DOMAIN + '/latest-blogs',
      {
        page,
      }
    );

    console.log(data.blogs);

    const formatedData = await filterPagination({
      state: blogs,
      data: data.blogs,
      page,
      countRoute: '/all-latest-blog-count',
    });

    console.log(formatedData);

    setBlogs(formatedData);
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

  const fetchBlogsByCategory = async () => {
    const {
      data: { blogs },
    } = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/search-blogs', {
      tag: pageState,
    });
    console.log(blogs);
    setBlogs(blogs);
  };

  useEffect(() => {
    activeTabRef.current.click();

    if (pageState === 'home') {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogsByCategory();
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
              ) : blogs.results.length ? (
                blogs.results.map((blog, i) => (
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
              ) : (
                <NoData message="No blogs published" />
              )}
              <LoadMoreButton state={blogs} fetchData={fetchLatestBlogs} />
            </>

            {trendingBlogs == null ? (
              <Loader />
            ) : trendingBlogs.length ? (
              trendingBlogs.map((blog, i) => (
                <AnimationWrapper
                  transition={{ duration: 1, delay: i * 0.1 }}
                  key={i}
                >
                  <MinimalBlogPost blog={blog} index={i} />
                </AnimationWrapper>
              ))
            ) : (
              <NoData message="No trending blogs" />
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
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, i) => (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                ))
              ) : (
                <NoData message="No trending blogs" />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
