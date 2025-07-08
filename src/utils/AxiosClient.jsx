// import axios from "axios";

// export const axiosClient = axios.create({
//   baseURL:process.env.NEXT_PUBLIC_BASE_URL,
// });

import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "http://localhost:1234/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

