import axios from "axios";

export const api = axios.create({
  baseURL: "https://mangalivre.net/",
  headers: {
    "x-requested-with": "XMLHttpRequest",
    "content-type": "application/x-www-form-urlencoded",
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
  },
});
