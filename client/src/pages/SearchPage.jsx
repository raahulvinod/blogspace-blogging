import { useParams } from 'react-router-dom';
import InpageNavigation from '../components/InpageNavigation';
import { Loader } from '../components/Loader';
import AnimationWrapper from '../utils/animation';
import BlogPostCard from '../components/BlogPostCard';
import NoData from '../components/NoData';
import LoadMoreButton from '../components/LoadMoreButton';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { filterPagination } from '../utils/filterPagination';

const SearchPage = () => {
  const { query } = useParams();
  const [blogs, setBlogs] = useState(null);
  const [users, setUsers] = useState(null);

  const searchBlogs = async ({ page = 1, create_new_arr = false }) => {
    const { data } = await axios.post(
      import.meta.env.VITE_SERVER_DOMAIN + '/search-blogs',
      {
        query,
        page,
      }
    );

    const formatedData = await filterPagination({
      state: blogs,
      data: data.blogs,
      page,
      countRoute: '/search-blog-count',
      data_to_send: { query },
      create_new_arr,
    });

    setBlogs(formatedData);
  };

  const resetState = () => {
    setBlogs(null);
    setUsers(null);
  };

  const fetchUsers = async () => {
    const { data: users } = await axios.post(
      import.meta.env.VITE_SERVER_DOMAIN + '/search-users',
      {
        query,
      }
    );

    setUsers(users);
  };

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, create_new_arr: true });
    fetchUsers();
  }, [query]);

  return (
    <section className="h-cover flex justify-center gap-10 ">
      <div className="w-full">
        <InpageNavigation
          routes={[`Search Results from "${query}"`, 'Accounts Matched']}
          defaultHidden={['Accounts Matched']}
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
            <LoadMoreButton state={blogs} fetchData={searchBlogs} />
          </>
        </InpageNavigation>
      </div>
    </section>
  );
};

export default SearchPage;
