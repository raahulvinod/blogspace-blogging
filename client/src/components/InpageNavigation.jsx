import { useEffect, useRef, useState } from 'react';

const InpageNavigation = ({
  routes,
  defaultHidden = [],
  defaultActiveIndex = 0,
  children,
}) => {
  const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

  const activeTabLineRef = useRef();
  const activeTabRef = useRef();

  const changePageState = (button, index) => {
    const { offsetWidth, offsetLeft } = button;

    activeTabLineRef.current.style.width = offsetWidth + 'px';
    activeTabLineRef.current.style.left = offsetLeft + 'px';

    setInPageNavIndex(index);
  };

  useEffect(() => {
    changePageState(activeTabRef.current, defaultActiveIndex);
  }, []);

  return (
    <>
      <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
        {routes.map((route, index) => (
          <button
            className={`p-4 px-5 capitalize ${
              inPageNavIndex === index ? 'text-black' : 'text-dark-grey'
            } ${defaultHidden.includes(route) ? 'md:hidden' : ''}`}
            key={index}
            onClick={(e) => changePageState(e.target, index)}
            ref={index === defaultActiveIndex ? activeTabRef : null}
          >
            {route}
          </button>
        ))}
        <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300" />
      </div>
      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  );
};

export default InpageNavigation;
