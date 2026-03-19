import { useContext, useState } from "react";
import { getDownloadLink } from "../services/downloadApi";
import { DownloadContext } from "../download.context";

export function useDownload() {

  const context = useContext(DownloadContext)

  const {loading, setLoading} = context

  const download = async (url) => {
    try {
      setLoading(true);

      const data = await getDownloadLink(url);
      window.location.href = data.downloadUrl;

    } catch (err) {
      alert("Download failed");
    } finally {
      setLoading(false);
    }
  };

  return { download, loading };
}