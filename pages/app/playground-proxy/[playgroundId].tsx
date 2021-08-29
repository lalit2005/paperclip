// this proxy is used to redirect the user to the playground page because the a prefetched page does not post data to iframe

import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';

const Page = () => {
  const router = useRouter();
  const { playgroundId } = router.query;
  router.push(`/app/playgrounds/${playgroundId}`);
  return <div>Loading...</div>;
};

export default withPageAuthRequired(Page);
