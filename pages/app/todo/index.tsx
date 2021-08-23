/* eslint-disable react-hooks/rules-of-hooks */
import NoteTag from '@/components/note/NoteTag';
import SearchInput from '@/components/note/SearchInput';
import fetcher from '@/lib/fetcher';
import { UserProfile, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { notes as notesType, todolists } from '@prisma/client';
import DashboardLayout from 'layouts/DashboardLayout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Fuse from 'fuse.js';
import Skeleton from 'react-loading-skeleton';
import Head from 'next/head';
import * as Checkbox from '@radix-ui/react-checkbox';
import { HiCheck } from 'react-icons/hi';
import getUniqueTags from '@/lib/get-unique-tags';
import TagNotesViewer from '@/components/note/TagNotesViewer';
import getNotesDataByTags from '@/lib/get-notes-data-by-tags';
import searchTags from '@/lib/search-tags';

const Page: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { data: todolists } = useSWR<todolists[]>(
    '/api/todo/get-all-todolists',
    fetcher
  );

  return (
    <div>
      <Head>
        <title>{user.name || user.nickname}&apos;s Todolists</title>
      </Head>
      <DashboardLayout>
        <h1 className='mb-16 text-4xl font-extrabold text-center'>
          Your Todo Lists ✔️
        </h1>
        <div className='flex flex-wrap mt-10'>
          {todolists?.map((todolist) => (
            <div
              key={todolist?.id}
              className='w-1/3 px-5 py-2 mx-auto my-3 transition-all rounded shadow hover:shadow-lg'>
              <Link href={`/app/todo/${todolist?.id}`}>
                <a className='block'>
                  <h3 className='my-3 text-xl font-medium'>
                    {todolist?.todolistName}
                  </h3>
                  <p className='my-5 text-gray-700 font-lg'>
                    {todolist?.todolistDescription}
                  </p>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </DashboardLayout>
    </div>
  );
};

export default withPageAuthRequired(Page);
