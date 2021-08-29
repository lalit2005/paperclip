import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';

const Page = () => {
  const router = useRouter();
  const { playgroundId } = router.query;
  router.push(`/app/playgrounds/${playgroundId}`);
  return <div>Loading...</div>;
};

export default withPageAuthRequired(Page);
