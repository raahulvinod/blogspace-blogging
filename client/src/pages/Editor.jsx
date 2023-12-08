import { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import { Navigate, useParams } from 'react-router-dom';
import BlogEditor from '../components/BlogEditor';
import PublishForm from '../components/PublishForm';
import { Loader } from '../components/Loader';
import axios from 'axios';

const blogStructure = {
  title: '',
  banner: '',
  content: [],
  tags: [],
  des: '',
  author: { personal_info: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
  const { blogId } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState('editor');
  const [textEditor, setTextEditor] = useState({ isReady: false });
  const [loading, setLoading] = useState(true);

  const { userAuth: { access_token } = {} } = useContext(UserContext);

  const getBlog = async () => {
    try {
      const {
        data: { blog },
      } = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/get-blog', {
        blogId,
        draft: true,
        mode: 'edit',
      });

      setBlog(blog);
      setLoading(false);
    } catch (error) {
      setBlog(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!blogId) {
      return setLoading(false);
    }
    getBlog();
  }, []);

  return (
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editorState,
        setEditorState,
        textEditor,
        setTextEditor,
      }}
    >
      {access_token === null ? (
        <Navigate to="/signup" />
      ) : loading ? (
        <Loader />
      ) : editorState === 'editor' ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
