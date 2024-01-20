const LoadMoreButton = ({ state, fetchData, additionalParam }) => {
  if (state !== null && state.totalDocs > state.results.length) {
    return (
      <button
        onClick={() => fetchData({ ...additionalParam, page: state.page + 1 })}
        className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md items-center gap-2"
      >
        Load more
      </button>
    );
  }
};

export default LoadMoreButton;
