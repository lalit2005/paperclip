/* eslint-disable react-hooks/rules-of-hooks */
import NoteTag from '@/components/note/NoteTag';
import SearchInput from '@/components/note/SearchInput';
import fetcher from '@/lib/fetcher';
import { UserProfile, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { notes as notesType } from '@prisma/client';
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

const index: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { data: notes } = useSWR<notesType[]>(
    '/api/notes/get-all-notes',
    fetcher
  );

  const [inputValue, setInputValue] = useState('');
  const [isSortedBasedOnTagsChecked, setIsSortedBasedOnTagsChecked] =
    useState<boolean>(false);

  useEffect(() => {
    setIsSortedBasedOnTagsChecked(
      JSON.parse(localStorage.getItem('isSorted')) || false
    );
  }, []);

  const fuse = new Fuse(notes, {
    keys: ['noteHeading', 'noteDescription', 'note', 'tags'],
    includeMatches: true,
    useExtendedSearch: true,
  });

  const results = inputValue ? fuse.search(inputValue) : notes;

  const searchedNotes = searchTags(getUniqueTags(notes), inputValue);

  return (
    <div>
      <Head>
        <title>{user.name || user.nickname}&apos;s Notes</title>
      </Head>
      <DashboardLayout>
        <h1 className='mb-16 text-4xl font-extrabold text-center'>
          Your notes 📔
        </h1>
        <SearchInput
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            console.log(results);
          }}
        />
        <div
          className='flex items-center w-full mb-6 text-left text-gray-500'
          style={{ zoom: '0.9' }}>
          <Checkbox.Root
            id='check'
            checked={isSortedBasedOnTagsChecked}
            onCheckedChange={(isChecked) => {
              // @ts-ignore
              setIsSortedBasedOnTagsChecked(isChecked);
              localStorage.setItem(
                'isSorted',
                (!isSortedBasedOnTagsChecked).toString()
              );
            }}
            className='inline-flex items-center justify-center w-5 h-5 mr-2 text-gray-600 border border-gray-400 rounded shadow focus:ring focus:ring-gray-600 group checked:bg-gray-500 checked:text-gray-50'>
            <Checkbox.Indicator>
              <HiCheck />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label htmlFor='check'>Sort based on Tags</label>
        </div>

        {!isSortedBasedOnTagsChecked ? (
          <div className='flex flex-wrap justify-evenly'>
            {results?.map((note) => (
              <Link
                key={note.id || note.item.id}
                href={`/app/notes/${note.id || note.item.id}`}>
                <a className='inline-block w-full max-w-xl'>
                  <div className='p-5 my-4 border border-gray-500 rounded shadow-md hover:bg-gray-50'>
                    <h3 className='text-lg text-gray-900'>
                      {note.noteHeading || note.item.noteHeading}
                    </h3>
                    <p className='text-gray-600 font-base'>
                      {note.noteDescription || note.item.noteDescription}
                    </p>
                    <div className='my-5'>
                      {note?.tags?.map((tag) => (
                        <NoteTag key={tag} tag={tag} />
                      )) ||
                        note?.item?.tags?.map((tag) => (
                          <NoteTag key={tag} tag={tag} />
                        ))}
                    </div>
                  </div>
                </a>
              </Link>
            )) || (
              <Skeleton
                height='150px'
                width='100%'
                count={3}
                className='inline-block w-full max-w-xl my-4 rounded shadow-sm'
              />
            )}
          </div>
        ) : (
          <div className='flex flex-wrap justify-evenly'>
            {/* @ts-ignore */}
            {notes ? (
              searchedNotes?.map((tag) => (
                <TagNotesViewer
                  tag={tag}
                  notesData={getNotesDataByTags(notes, tag)}
                  key={tag}
                />
              ))
            ) : (
              <Skeleton
                height='70px'
                width='100%'
                count={5}
                className='inline-block w-full max-w-xl my-4 rounded shadow-sm'
              />
            )}
          </div>
        )}
      </DashboardLayout>
    </div>
  );
};

export default withPageAuthRequired(index);
