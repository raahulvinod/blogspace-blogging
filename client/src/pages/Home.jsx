import axios from 'axios';
import { useEffect, useState } from 'react';

import InpageNavigation from '../components/InpageNavigation';
import AnimationWrapper from '../utils/animation';
import { Loader } from '../components/Loader';
import BlogPostCard from '../components/BlogPostCard';

const Home = () => {
  const [blogs, setBlogs] = useState();

  const fetchLatestBlogs = async () => {
    const {
      data: { blogs },
    } = await axios.get(import.meta.env.VITE_SERVER_DOMAIN + '/latest-blogs');

    setBlogs(blogs);
  };

  console.log(blogs);

  useEffect(() => {
    fetchLatestBlogs();
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

            <h1>trending blogs here</h1>
          </InpageNavigation>
        </div>

        {/* Filters and trending blogs */}
        <div></div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
