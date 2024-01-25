import { Link } from 'react-router-dom';

import pageNotFound from '../images/errorpage.jpg';
import fullLogo from '../images/full-blog-logo.png';
import fullLogoLight from '../images/full-logo-white.png';
import { useContext } from 'react';
import { ThemeContext } from '../App';

const PageNotFound = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
      <img
        src={pageNotFound}
        className="select-none w-80 aspect-square object-cover rounded-md"
      />
      <h1 className="text-4xl font-gelasio leading-7">Page not found</h1>
      <p className="text-dark-grey text-xl leading-7 -mt-12">
        The page you are looking for does not exists. back to the{' '}
        <Link to="/" className="text-black underline">
          home page.
        </Link>
      </p>

      <div className="mt-auto">
        <img
          src={theme === 'light' ? fullLogo : fullLogoLight}
          className="h-8 object-contain block mx-auto select-none"
        />
        <p className="mt-5 text-dark-grey">
          Read millions of stories around the world
        </p>
      </div>
    </section>
  );
};

export default PageNotFound;
