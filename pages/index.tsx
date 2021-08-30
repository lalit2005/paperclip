import Nav from '@/components/Nav';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0';

export default function Home() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    router.prefetch('/app');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (user) {
    router.push('/app');
  }

  return (
    <div>
      <iframe
        src='https://paperclip.pagely.site'
        frameBorder='0'
        className='w-screen min-h-screen'></iframe>
    </div>
  );
}
