import DashboardNav from '@/components/dashboard/DashboardNav';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { whiteboards } from '@prisma/client';
import DashboardLayout from 'layouts/DashboardLayout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from 'react';
import useSWR from 'swr';

const Page = () => {
  const router = useRouter();
  const { whiteboardId } = router.query;
  const { data } = useSWR<whiteboards>(
    `/api/whiteboard/get-board/?boardId=${whiteboardId}`
  );

  const [boardLoaded, setBoardLoaded] = useState(false);

  return (
    <DashboardLayout className='!w-screen !-mt-10'>
      <iframe
        src={data?.boardUrl}
        id='excalidraw-iframe'
        frameBorder='0'
        allowFullScreen
        allowTransparency
        className='w-screen h-[90vh]'
        onLoad={() => setBoardLoaded(true)}
        allow='clipboard-read; clipboard-write; allow-popups; allow-downloads; allow-modals;'
      />
      {boardLoaded === false && <div className=''>Loading...</div>}
    </DashboardLayout>
  );
};

export default withPageAuthRequired(Page);
