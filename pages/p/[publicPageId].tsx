import prisma from '@/utils/prisma';
import { GetStaticPaths, GetStaticProps } from 'next';
import Note from '@/components/note/PublicNote';
import NoteTag from '@/components/note/NoteTag';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import NextLink from 'next/link';

const Page = ({
  content,
  heading: noteHeading,
  description: noteDescription,
  emoji,
  tags,
  publicId,
}) => {
  return (
    <div className='min-h-screen text-sm md:text-base bg-gray-50 px-3'>
      <Head>
        <title>
          {noteHeading || 'Note'} {'| ' + noteDescription}
        </title>
        <link
          rel='shortcut icon'
          href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>`}
          type='image/x-icon'
        />
      </Head>
      <NextSeo
        title={noteHeading || 'Paperclip note'}
        description={noteDescription}
        openGraph={{
          url: 'https://usepaperclip.vercel.app/p/' + publicId,
          title: noteHeading || 'Paperclip',
          description:
            noteDescription ||
            'Paperclip is more than just a note taking app. It is the only productivity tool you will ever need.',
          images: [
            {
              url: 'https://usepaperclip.vercel.app/ogimage.png',
            },
          ],
          site_name: noteHeading || 'Paperclip',
        }}
        twitter={{
          handle: '@lalitcodes',
          cardType: 'summary_large_image',
        }}
      />
      <div className='max-w-5xl mx-auto pt-10 sm:pt-16'>
        <div className='items-start justify-start sm:flex group'>
          {/* <span className='inline-block sm:mr-5 text-4xl font-bold'>
            {emoji}
          </span> */}
          <div className='inline-block'>
            <h1 className='text-4xl mt-3 sm:mt-auto font-bold'>
              {noteHeading}
            </h1>
            <div className='sm:mt-4 mt-2 text-lg text-gray-500'>
              <h2>{noteDescription}</h2>
            </div>
            <div className='mt-3 tags'>
              {tags.map((tag) => (
                <NoteTag key={tag} tag={tag} />
              ))}
            </div>
          </div>
        </div>
        <div className='-mt-5 note-container'>
          <Note noteContent={content} />
          <footer className='py-4 text-sm border-t border-gray-300'>
            <p>
              Built with{' '}
              <NextLink href='/app/notes'>
                <a className='text-blue-500 hover:underline'>Paperclip</a>
              </NextLink>
            </p>
            <p>
              An app by{' '}
              <a
                className='text-blue-500 hover:underline'
                target='__blanlk'
                href='https://lalit.sh'>
                Lalit
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const pageId = params.publicPageId;
    const pageData = await prisma.notes.findUnique({
      where: {
        publicId: pageId.toString(),
      },
    });

    if (pageData.isPublic !== true) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        content: pageData.note,
        heading: pageData.noteHeading,
        description: pageData.noteDescription,
        emoji: pageData.emoji,
        tags: pageData.tags,
        publicId: pageData.publicId,
      },
      revalidate: 90,
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default Page;
