import { async } from "regenerator-runtime";

import { instance } from "./axios";

export const getFileExplore = async () => {
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0dWFuaHQyazIiLCJpYXQiOjE3MDA4NzgwMjEsImV4cCI6MTcwMDk2NDQyMX0.RJGmh0kBWg6XjNiXvgjSLJc3Nlx0TQPhwUEMRSbv50E";

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fileExplore = await instance
    .get("/folders/userid=655eb14b39a63748b6d9505d/root", config)
    .then((res) => res.data)
    .catch((err) => console.log(err));

  return {
    props: { fileExplore },
  };
};
