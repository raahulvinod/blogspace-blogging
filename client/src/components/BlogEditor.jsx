import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';

import logo from '../images/blog.png';
import AnimationWrapper from '../utils/animation';
import deafaultBanner from '../images/blog banner.png';
import { uploadImage } from '../utils/aws';

const BlogEditor = () => {
  const blogBannerRef = useRef();

  const handleBannerUpload = async (e) => {
    const image = e.target.files[0];

    if (image) {
      let loadingToast = toast.loading('Uploading...');

      try {
        const url = await uploadImage(image);

        if (url) {
          toast.dismiss(loadingToast);
          toast.success('Image uploaded successfully.');
          blogBannerRef.current.src = url;
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        return toast.error(error);
      }
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="logo" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-fulls">
          New Blog
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2">Publish</button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>
      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img
                  ref={blogBannerRef}
                  src={deafaultBanner}
                  className="z-20"
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
