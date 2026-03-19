import {createContext, useState } from "react";

export const DownloadContext = createContext()

export const DownloadProvider = ({ children }) => {

  const [loading, setLoading] = useState(false)

  return (
    <DownloadContext.Provider value={{ loading, setLoading }}>
      {children}
    </DownloadContext.Provider>
  )
}