import axios from 'axios';

export default function postNotice(
  data,
  route,
  setError,
  setIsLoading,
  setNotices
) {
  setError(false);
  setIsLoading(true);
  axios
    .post(`/notices`, data)
    .then(result => {
      if (result.data.category === route || route === 'owner') {
        setNotices(prev => [result.data, ...prev]);
      }
    })
    .catch(error => setError(error.message))
    .finally(() => {
      setIsLoading(false);
    });
}
