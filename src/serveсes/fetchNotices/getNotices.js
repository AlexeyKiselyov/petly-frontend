import axios from "axios";

export default function getNotices(
  route,
  pageNumber,
  searchTitleQwery,
  setError,
  setIsLoading,
  setNotices
) {
  setError(false);
  setIsLoading(true);
  axios(
    `/notices/${route}?page=${pageNumber}&limit=${8}&qwery=${searchTitleQwery}`
  )
    .then(res => {
      setNotices(prev => {
        return [...prev, ...res.data.notices];
      });
    })
    .catch(error => setError(error.message))
    .finally(() => {
      setIsLoading(false);
    });
}
