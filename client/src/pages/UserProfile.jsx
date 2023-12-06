import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

import AnimationWrapper from '../utils/animation';
import { Loader } from '../components/Loader';
import { UserContext } from '../App';
import AboutUser from '../components/AboutUser';
import { filterPagination } from '../utils/filterPagination';
import InpageNavigation from '../components/InpageNavigation';
import BlogPostCard from '../components/BlogPostCard';
import NoData from '../components/NoData';
import LoadMoreButton from '../components/LoadMoreButton';

export const profileDataStructure = {
  personal_info: {
    fullname: '',
    username: '',
    profile_img: '',
    bio: '',
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  social_links: {},
  joinedAt: '',
};

const UserProfile = () => {
  const { id: profileId } = useParams();

  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState(null);

  const {
    personal_info: { fullname, username: profile_username, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = profile;

  const { userAuth: { username } = {} } = useContext(UserContext);

  const getBlogs = async ({ page = 1, user_id }) => {
    user_id = user_id == undefined ? blogs.user_id : user_id;

    const { data } = await axios.post(
      import.meta.env.VITE_SERVER_DOMAIN + '/search-blogs',
      { author: user_id, page }
    );

    let formattedData = await filterPagination({
      state: blogs,
      data: data.blogs,
      page,
      countRoute: '/search-blog-count',
      data_to_send: { author: user_id },
    });

    formattedData.user_id = user_id;

    setBlogs(formattedData);
  };

  const fetchUserProfile = async () => {
    const { data: user } = await axios.post(
      import.meta.env.VITE_SERVER_DOMAIN + '/get-profile',
      { username: profileId }
    );

    setProfile(user);
    getBlogs({ user_id: user._id });
    setLoading(false);
  };

  useEffect(() => {
    resetState();
    fetchUserProfile(UserContext);
  }, [profileId]);

  const resetState = () => {
    setProfile(profileDataStructure);
    setLoading(true);
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px]">
            <img
              src={profile_img}
              className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
            />
            <h1 className="text-2xl font-medium">@{profile_username}</h1>
            <p className="text-xl capitalize h-6">{fullname}</p>
            <p className="">
              {total_posts.toLocaleString()} Blogs -{' '}
              {total_reads.toLocaleString()} - Reads
            </p>

            <div className="flex gap-4 mt-2">
              {profileId === username ? (
                <Link
                  to="/settings/edit-profile"
                  className="btn-light rounded-md"
                >
                  Edit profile
                </Link>
              ) : (
                ''
              )}
            </div>

            <AboutUser
              bio={bio}
              socialLinks={social_links}
              joinedAt={joinedAt}
              className="max-md:hidden"
            />
          </div>

          <div className="max-md:mt-12 w-full">
            <InpageNavigation
              routes={['Blogs published', 'About']}
              defaultHidden={['About']}
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
                <LoadMoreButton state={blogs} fetchData={getBlogs} />
              </>

              <AboutUser
                bio={bio}
                socialLinks={social_links}
                joinedAt={joinedAt}
              />
            </InpageNavigation>
          </div>
        </section>
      )}
    </AnimationWrapper>
  );
};

export default UserProfile;
