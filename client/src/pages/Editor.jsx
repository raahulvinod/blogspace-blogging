import { useContext, useState } from 'react';
import { UserContext } from '../App';
import { Navigate } from 'react-router-dom';
import BlogEditor from '../components/BlogEditor';
import PublishForm from '../components/PublishForm';

const Editor = () => {
  const [editorState, setEditorState] = useState('editor');

  const { userAuth: { access_token } = {} } = useContext(UserContext);
  return access_token === null ? (
    <Navigate to="/signup" />
  ) : editorState === 'editor' ? (
    <BlogEditor />
  ) : (
    <PublishForm />
  );
};

export default Editor;
