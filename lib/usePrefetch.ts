import { useRouter } from 'next/router';
import { useEffect } from 'react';

const usePrefetch = (paths: string[]) => {
  const router = useRouter();
  useEffect(() => {
    paths.forEach((path) => {
      router.prefetch(path);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return router;
};

export default usePrefetch;
