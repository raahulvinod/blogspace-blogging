import axios from 'axios';
import { useContext, useEffect, useState } from 'react';

import { UserContext } from '../App';
import { filterPagination } from '../utils/filterPagination';
import { Toaster } from 'react-hot-toast';

import InpageNavigation from '../components/InpageNavigation';
import { Loader } from '../components/Loader';
import NoData from '../components/NoData';
import AnimationWrapper from '../utils/animation';
import {
  ManagePubllishedBlogCard,
  ManageDraftBlogPost,
} from '../components/ManagePubllishedBlogCard';
import LoadMoreButton from '../components/LoadMoreButton';

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [query, setQuery] = useState('');

  const { userAuth: { access_token } = {} } = useContext(UserContext);

  const getBlogs = async ({ page, draft, deletedDocCount = 0 }) => {
    try {
      const { data } = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + '/user-written-blogs',
        { page, draft, query, deletedDocCount },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const formattedData = await filterPagination({
        state: draft ? drafts : blogs,
        data: data.blogs,
        page,
        user: access_token,
        countRoute: '/user-written-blogs-count',
        data_to_send: { draft, query },
      });

      if (draft) setDrafts(formattedData);
      else setBlogs(formattedData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    const searchQuery = e.target.value;

    setQuery(searchQuery);

    if (e.keyCode === 13 && searchQuery.length) {
      setBlogs(null);
      setDrafts(null);
    }
  };

  const handleChange = (e) => {
    if (!e.target.value.length) {
      setQuery('');
      setBlogs(null);
      setDrafts(null);
    }
  };

  useEffect(() => {
    if (access_token) {
      if (blogs === null) getBlogs({ page: 1, draft: false });
      if (drafts === null) getBlogs({ page: 1, draft: true });
    }
  }, [access_token, blogs, drafts, query]);

  return (
    <>
      <h1 className="max-md:hidden">Manage Blogs</h1>

      <Toaster />

      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          type="search"
          className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
          placeholder="Search blogs"
          onChange={handleChange}
          onKeyDown={handleSearch}
        />
        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
      </div>

      <InpageNavigation routes={['Published Blogs', 'Drafts']}>
        {
          // Published blogs
          blogs === null ? (
            <Loader />
          ) : blogs.results.length ? (
            <>
              {blogs.results.map((blog, i) => {
                return (
                  <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                    <ManagePubllishedBlogCard
                      blog={{ ...blog, index: i, setStateFunc: setBlogs }}
                    />
                  </AnimationWrapper>
                );
              })}
              <LoadMoreButton
                state={blogs}
                fetchData={getBlogs}
                additionalParam={{
                  draft: false,
                  deletedDocCount: blogs.deletedDocCount,
                }}
              />
            </>
          ) : (
            <NoData message="No published blogs" />
          )
        }

        {
          // Draft blogs
          drafts === null ? (
            <Loader />
          ) : drafts.results.length ? (
            <>
              {drafts.results.map((blog, i) => {
                return (
                  <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                    <ManageDraftBlogPost
                      blog={{ ...blog, index: i, setStateFunc: setDrafts }}
                    />
                  </AnimationWrapper>
                );
              })}
              <LoadMoreButton
                state={drafts}
                fetchData={getBlogs}
                additionalParam={{
                  draft: true,
                  deletedDocCount: drafts.deletedDocCount,
                }}
              />
            </>
          ) : (
            <NoData message="No draft blogs" />
          )
        }
      </InpageNavigation>
    </>
  );
};

export default ManageBlogs;
