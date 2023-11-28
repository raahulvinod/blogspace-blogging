import { useContext } from 'react';

import { EditorContext } from '../pages/Editor';

const Tags = ({ tag, tagIndex }) => {
  let {
    blog,
    blog: { tags },
    setBlog,
  } = useContext(EditorContext);

  const handleTagEdit = (e) => {
    if (e.keyCode === 13 || e.keyCode === 118) {
      e.preventDefault();

      let currentTag = e.target.innerText;

      tags[tagIndex] = currentTag;

      setBlog({ ...blog, tags });

      e.target.setAttribute('contentEditable', false);
    }
  };

  const addEditableContent = (e) => {
    e.target.setAttribute('contentEditable', true);
    e.target.focus();
  };

  const handleTagdelete = () => {
    tags = tags.filter((t) => t !== tag);
    setBlog({ ...blog, tags });
  };

  return (
    <div className="relative p-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
      <p
        className="outline-none"
        onKeyDown={handleTagEdit}
        onClick={addEditableContent}
      >
        {tag}
      </p>
      <button
        className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
        onClick={handleTagdelete}
      >
        <i className="fi fi-br-cross text-sm pointer-events-none"></i>
      </button>
    </div>
  );
};

export default Tags;
