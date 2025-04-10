const { REACT_APP_API_URL } = process.env;
const BASE_URL = REACT_APP_API_URL;

export const getNews = async ({ page = 1, limit = 0 }) => {
  const response = await fetch(`${BASE_URL}/news?page=${page}&limit=${limit}`);
  const result = response.json();
  return result;
};
