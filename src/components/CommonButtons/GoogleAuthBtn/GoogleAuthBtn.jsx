import { Button } from './GoogleAuthBtn.styled';
import { FcGoogle } from 'react-icons/fc';

export const GoogleAuthBtn = ({ text }) => {
  const { REACT_APP_API_URL } = process.env;
  return (
    <Button href={`${REACT_APP_API_URL}/auth/google`}>
      <FcGoogle size={25} />
      {text}
    </Button>
  );
};
