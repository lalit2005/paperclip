import prisma from '@/utils/prisma'
import { GetStaticPaths, GetStaticProps } from 'next'
import Note from '@/components/note/PublicNote'
import NoteTag from '@/components/note/NoteTag'
import Head from 'next/head'

const Page = ({
  content,
  heading: noteHeading,
  description: noteDescription,
  emoji,
  tags,
}) => {
  return (
    <div className='min-h-screen px-10 bg-gray-50'>
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
      <div className='max-w-5xl pt-16 mx-auto px-7'>
        <div className='items-start justify-start sm:flex group'>
          <span className='inline-block mr-5 text-4xl font-bold'>{emoji}</span>
          <div className='inline-block'>
            <h1 className='text-4xl font-bold'>{noteHeading}</h1>
            <div className='mt-4 text-lg text-gray-500'>
              <h2>{noteDescription} </h2>
            </div>
            <div className='mt-3 tags'>
              {tags.map((tag) => (
                <NoteTag key={tag} tag={tag} />
              ))}
            </div>
          </div>
        </div>
        <div className='mt-12 bg-white note-container'>
          <Note noteId='hello' isModalOpen={false} noteContent={content} />
        </div>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const pageId = params.publicPageId
    const pageData = await prisma.notes.findUnique({
      where: {
        publicId: pageId.toString(),
      },
    })

    if (pageData.isPublic !== true) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        content: pageData.note,
        heading: pageData.noteHeading,
        description: pageData.noteDescription,
        emoji: pageData.emoji,
        tags: pageData.tags,
      },
      revalidate: 10 * 60,
    }
  } catch (error) {
    console.log(error)
    return {
      notFound: true,
    }
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default Page
