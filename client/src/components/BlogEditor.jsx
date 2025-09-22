import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import EditorJS from '@editorjs/editorjs';

import logo from '../images/blog.png';
import logoWhite from '../images/logoWhite.png';
import AnimationWrapper from '../utils/animation';
import deafaultBanner from '../images/blog banner.png';
import darkBanner from '../images/blog-banner-dark.png';
import { ThemeContext, UserContext } from '../App';
import { uploadImage } from '../utils/aws';
import { EditorContext } from '../pages/Editor';
import { tools } from './Tools';

const BlogEditor = () => {
  const {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  const { blogId } = useParams();

  const { userAuth: { access_token } = {} } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor(
        new EditorJS({
          holder: 'textEditor',
          data: Array.isArray(content) ? content[0] : content,
          tools: tools,
          placeholder: 'Lets write something...',
        })
      );
    }
  }, []);

  const handleBannerUpload = async (e) => {
    const image = e.target.files[0];

    if (image) {
      let loadingToast = toast.loading('Uploading...');

      try {
        const url = await uploadImage(image);

        if (url) {
          toast.dismiss(loadingToast);
          toast.success('Image uploaded successfully.');

          setBlog({ ...blog, banner: url });
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        return toast.error(error);
      }
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    let input = e.target;

    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';

    setBlog({ ...blog, title: input.value });
  };

  const handleError = (e) => {
    let img = e.target;

    img.src = theme === 'light' ? deafaultBanner : darkBanner;
  };

  const handlePublish = async () => {
    if (!banner.length) {
      return toast.error('Upload a blog banner to publish it.');
    }

    if (!title.length) {
      return toast.error('Write blog title to publish it.');
    }

    if (textEditor.isReady) {
      try {
        const data = await textEditor.save();

        if (data.blocks.length) {
          setBlog({ ...blog, content: data });
          setEditorState('publish');
        } else {
          toast.error('Write content in your blog to publish it.');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSaveDraft = async () => {
    let loadingToast;

    try {
      if (!title.length) {
        return toast.error('Write blog title before saving it as a draft.');
      }

      setIsLoading(true);
      loadingToast = toast.loading('Saving draft...');

      if (textEditor.isReady) {
        const content = await textEditor.save();

        const blogData = {
          title,
          des,
          banner,
          tags,
          content,
          draft: true,
        };

        await axios.post(
          import.meta.env.VITE_SERVER_DOMAIN + '/create-blog',
          { ...blogData, id: blogId },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        setIsLoading(false);
        toast.dismiss(loadingToast);
        toast.success('Saved.');

        setTimeout(() => {
          navigate('/dashboard/blogs?tab=draft');
        }, 500);
      }
    } catch (error) {
      console.error(error);

      setIsLoading(false);
      toast.dismiss(loadingToast);
      toast.error(error.response.data.error);
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={theme === 'light' ? logo : logoWhite} alt="logo" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-fulls">
          {title.length ? title : 'New Blog'}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublish}>
            Publish
          </button>
          <button
            className="btn-light py-2"
            onClick={handleSaveDraft}
            disabled={isLoading}
          >
            Save Draft
          </button>
        </div>
      </nav>
      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img src={banner} className="z-20" onError={handleError} />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={title}
              placeholder="Blog title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>
            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
