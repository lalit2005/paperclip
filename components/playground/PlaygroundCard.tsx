// @ts-nocheck

import { CodePlayground } from '@prisma/client';
import Link from 'next/link';
import NoteTag from '../whiteboard/BoardTag';
import Fuse from 'fuse.js';

const PlaygroundCard: React.FC<{
  playground: CodePlayground | Fuse.FuseResult<CodePlayground>;
}> = ({ playground }) => {
  return (
    <Link href={`/app/playgrounds/${playground.id || playground.item.id}`}>
      <a className='inline-block w-full max-w-xl'>
        <div className='p-5 my-4 border border-gray-500 rounded shadow-md hover:bg-gray-50'>
          <h3 className='text-lg text-gray-900'>
            {playground?.playgroundName || playground?.item?.playgroundName}
          </h3>
          <div className='my-5'>
            {playground?.tags?.map((tag) => <NoteTag key={tag} tag={tag} />) ||
              playground?.item?.tags?.map((tag) => (
                <NoteTag key={tag} tag={tag} />
              ))}
          </div>
        </div>
      </a>
    </Link>
  );
};

export default PlaygroundCard;
