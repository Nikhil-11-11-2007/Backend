import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
})

export async function getDownloadLink(url) {
  const res = await api.post(`/download`, { url });
  return res.data;
}
