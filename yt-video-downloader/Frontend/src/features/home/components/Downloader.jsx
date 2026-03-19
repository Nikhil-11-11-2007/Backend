import { useState } from "react";
import { useDownload } from "../hooks/useDownload";
import Loader from "./Loader";
import "../style/downloader.scss"

function Downloader() {
  const [url, setUrl] = useState("");
  const { download, loading } = useDownload();

  const handleClick = () => {
    if (!url) return alert("Enter YouTube URL");
    download(url);
  };

  return (
    <div className="container">
      <h1 className="title">🎵 YT to MP3 and MP4 Downloader</h1>

      <p className="subtitle">
        Paste your YouTube link and download audio and video instantly
      </p>

      <div className="inputBox">
        <input
          type="text"
          placeholder="Paste YouTube URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button onClick={handleClick}>
          {loading ? "Processing..." : "Redirect from Download page"}
        </button>
      </div>

      {loading && <Loader />}
    </div>
  );
}

export default Downloader;