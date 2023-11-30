import InpageNavigation from '../components/InpageNavigation';
import AnimationWrapper from '../utils/animation';

const Home = () => {
  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* Latest blogs */}
        <div className="w-full">
          <InpageNavigation
            routes={['home', 'trending blogs']}
            defaultHidden={['trending blogs']}
          >
            <h1>Latest blogs here</h1>
            <h1>trending blogs here</h1>
          </InpageNavigation>
        </div>

        {/* Filters and trending blogs */}
        <div></div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
