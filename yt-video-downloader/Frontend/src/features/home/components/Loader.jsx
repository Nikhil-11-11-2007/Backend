import "../style/loader.scss"

function Loader() {
  return (
    <div className="loader">
      <div className="spinner"></div>
      <p>Preparing your download...</p>
    </div>
  );
}

export default Loader;