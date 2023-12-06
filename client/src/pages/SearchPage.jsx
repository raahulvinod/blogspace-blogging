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
import UserCard from '../components/UserCard';

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

  const fetchUsers = async () => {
    const { data } = await axios.post(
      import.meta.env.VITE_SERVER_DOMAIN + '/search-users',
      {
        query,
      }
    );
    setUsers(data.users);
  };

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, create_new_arr: true });
    fetchUsers();
  }, [query]);

  const resetState = () => {
    setBlogs(null);
    setUsers(null);
  };

  const UserCardWrapper = () => {
    return (
      <>
        {users == null ? (
          <Loader />
        ) : users.length ? (
          users.map((user, i) => {
            return (
              <AnimationWrapper
                key={i}
                transition={{ duration: 1, delay: i * 0.08 }}
              >
                <UserCard user={user} />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoData message="No user found" />
        )}
      </>
    );
  };

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

          <UserCardWrapper />
        </InpageNavigation>
      </div>

      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8">
          User related to search <i className="fi fi-rr-user mt-1"></i>
        </h1>
        <UserCardWrapper />
      </div>
    </section>
  );
};

export default SearchPage;
