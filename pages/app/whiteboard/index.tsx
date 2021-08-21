/* eslint-disable react-hooks/rules-of-hooks */
import Tag from '@/components/note/NoteTag';
import SearchInput from '@/components/whiteboard/SearchInput';
import fetcher from '@/lib/fetcher';
import { UserProfile, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { whiteboards as whiteboardType } from '@prisma/client';
import DashboardLayout from 'layouts/DashboardLayout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Fuse from 'fuse.js';
import Skeleton from 'react-loading-skeleton';
import Head from 'next/head';
import * as Checkbox from '@radix-ui/react-checkbox';
import { HiCheck } from 'react-icons/hi';
import getUniqueBoardTags from '@/lib/get-unique-board-tags';
import TagBoardsViewer from '@/components/whiteboard/TagBoardsViewer';
import getBoardDataByTags from '@/lib/get-boards-data-by-tags';
import searchTags from '@/lib/search-tags';

const index: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { data: boards } = useSWR<whiteboardType[]>(
    '/api/whiteboard/get-all-boards',
    fetcher
  );

  const [inputValue, setInputValue] = useState('');
  const [
    isWhiteboardSortedBasedOnTagsChecked,
    setIsWhiteboardSortedBasedOnTagsChecked,
  ] = useState<boolean>(false);

  useEffect(() => {
    setIsWhiteboardSortedBasedOnTagsChecked(
      JSON.parse(localStorage.getItem('isWhiteboardSorted')) || false
    );
  }, []);

  const fuse = new Fuse(boards, {
    keys: ['boardName', 'boardDescription'],
    includeMatches: true,
    useExtendedSearch: true,
  });

  const results = inputValue ? fuse.search(inputValue) : boards;

  const searchedBoards = searchTags(getUniqueBoardTags(boards), inputValue);

  return (
    <div>
      <Head>
        <title>{user.name || user.nickname}&apos;s Whiteboards</title>
      </Head>
      <DashboardLayout>
        <h1 className='mb-16 text-4xl font-extrabold text-center'>
          Your Whiteboards 🎨
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
            checked={isWhiteboardSortedBasedOnTagsChecked}
            onCheckedChange={(isChecked) => {
              // @ts-ignore
              setIsWhiteboardSortedBasedOnTagsChecked(isChecked);
              localStorage.setItem(
                'isWhiteboardSorted',
                (!isWhiteboardSortedBasedOnTagsChecked).toString()
              );
            }}
            className='inline-flex items-center justify-center w-5 h-5 mr-2 text-gray-600 border border-gray-400 rounded shadow focus:ring focus:ring-gray-600 group checked:bg-gray-500 checked:text-gray-50'>
            <Checkbox.Indicator>
              <HiCheck />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label htmlFor='check'>Sort based on Tags</label>
        </div>

        {!isWhiteboardSortedBasedOnTagsChecked ? (
          <div className='flex flex-wrap justify-evenly'>
            {results?.map((whiteboard) => (
              <Link
                key={whiteboard?.id || whiteboard?.item?.id}
                href={`/app/whiteboard/${
                  whiteboard?.id || whiteboard?.item?.id
                }`}>
                <a className='inline-block w-full max-w-xl'>
                  <div className='p-5 my-4 border border-gray-500 rounded shadow-md hover:bg-gray-50'>
                    <h3 className='text-lg text-gray-900'>
                      {whiteboard?.boardName || whiteboard?.item?.boardName}
                    </h3>
                    <p className='text-gray-600 font-base'>
                      {whiteboard?.boardDescription ||
                        whiteboard?.item?.boardDescription}
                    </p>
                    <div className='my-5'>
                      {whiteboard?.tags?.map((tag) => (
                        <Tag key={tag} tag={tag} />
                      )) ||
                        whiteboard?.item?.tags?.map((tag) => (
                          <Tag key={tag} tag={tag} />
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
            {boards ? (
              searchedBoards?.map((tag) => (
                <TagBoardsViewer
                  tag={tag}
                  boardsData={getBoardDataByTags(boards, tag)}
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
