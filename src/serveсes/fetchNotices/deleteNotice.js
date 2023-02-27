import axios from 'axios';

export default function deleteNotice(
  id,
  notices,
  setError,
  setIsLoading,
  setNotices
) {
  setError(false);
  setIsLoading(true);
  axios
    .delete(`/notices/${id}`)
    .then(() => {
      setNotices(notices.filter(notice => notice._id !== id));
    })
    .catch(error => setError(error.message))
    .finally(() => {
      setIsLoading(false);
    });
}
