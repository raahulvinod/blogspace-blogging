import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

import { UserContext } from '../App';
import { profileDataStructure } from '../pages/UserProfile';
import AnimationWrapper from '../utils/animation';
import { Loader } from './Loader';
import InputBox from './InputBox';
import CustomInput from './CustomInput';

const EditProfile = () => {
  const { userAuth, userAuth: { access_token } = {} } = useContext(UserContext);

  let bioLimit = 150;

  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);
  const [charactersLeft, setCharactersLeft] = useState(bioLimit);

  const {
    personal_info: {
      username: profile_username,
      profile_img,
      fullname,
      email,
      bio,
    },
    social_links,
  } = profile;

  const getProfile = async () => {
    try {
      const { data: user } = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + '/get-profile',
        {
          username: userAuth.username,
        }
      );
      if (user) {
        setProfile(user);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (access_token) {
      getProfile();
    }
  }, [access_token]);

  const handleCharactersChange = (e) => {
    setCharactersLeft(bioLimit - e.target.value.length);
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <form>
          <Toaster />
          <h1 className="max-md:hidden">Edit Profile</h1>

          <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
            <div className="max-lg:center mb-5">
              <label
                htmlFor="uploadImg"
                id="profileImgLabel"
                className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden"
              >
                <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer">
                  Upload image
                </div>
                <img src={profile_img} />
              </label>
              <input
                type="file"
                id="uploadImg"
                accept=".jpeg, .png, .jpg"
                hidden
              />
              <button className="btn-light mt-5 max-lg:center lg:w-full px-10">
                upload
              </button>
            </div>

            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                <div>
                  <CustomInput
                    type="text"
                    name="fullname"
                    value={fullname}
                    placeholder="Full Name"
                    disable={true}
                    icon="fi-rr-user"
                  />
                </div>
                <div>
                  <CustomInput
                    type="email"
                    name="email"
                    value={fullname}
                    placeholder="Email address"
                    disable={true}
                    icon="fi-rr-envelope"
                  />
                </div>
              </div>

              <CustomInput
                type="text"
                name="usename"
                value={profile_username}
                placeholder="Username"
                icon="fi-rr-at"
              />
              <p className="text-dark-grey -mt-3">
                Usename will use to search user and will be visible to all users
              </p>

              <textarea
                name="bio"
                maxLength={bioLimit}
                defaultValue={bio}
                className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5"
                placeholder="Bio"
                onChange={handleCharactersChange}
              ></textarea>
              <p className="mt-1 text-dark-grey">
                {charactersLeft} characters left
              </p>
              <p className="my-6 text-dark-grey">
                Add your social handle below
              </p>

              <div className="md:grid md:grid-cols-2 gap-6 "></div>
            </div>
          </div>
        </form>
      )}
    </AnimationWrapper>
  );
};

export default EditProfile;
