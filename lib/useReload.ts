import { useRouter } from 'next/router';

const useReload = () => {
  const router = useRouter();
  return router.reload;
};

export default useReload;
