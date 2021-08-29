import { GetStaticPaths, GetStaticProps } from 'next';
import prisma from '@/utils/prisma';
import { useEffect, useState } from 'react';

const Page = (props) => {
  const [frameLoaded, setFrameLoaded] = useState(false);
  useEffect(() => {
    // @ts-ignore
    const editor: HTMLIFrameElement =
      document.getElementById('paperclip-editor');
    if (frameLoaded) {
      editor.contentWindow.postMessage(
        {
          sentByPaperclip: true,
          initialHTML: props?.html,
          initialCss: props?.css,
          initialJs: props?.js,
        },
        '*'
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameLoaded]);

  return (
    <div>
      <iframe
        src={process.env.NEXT_PUBLIC_PLAYGROUND_URL}
        frameBorder='0'
        allow='clipboard-read; clipboard-write; allow-popups; allow-downloads; allow-modals;'
        id='paperclip-editor'
        onLoad={() => setFrameLoaded(true)}
        className='!w-screen h-screen'>
        Loading...
      </iframe>
    </div>
  );
};

export default Page;

export const getStaticProps: GetStaticProps = async (ctx) => {
  const playgroundId = ctx.params.publicPlaygroundId as string;
  const playgroundData = await prisma.codePlayground.findUnique({
    where: {
      publicId: playgroundId,
    },
  });
  if (!playgroundData) {
    return {
      notFound: true,
    };
  } else if (playgroundData.isPublic === false) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        html: playgroundData.html,
        css: playgroundData.css,
        js: playgroundData.js,
        name: playgroundData.playgroundName,
      },
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
