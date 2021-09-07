/* eslint-disable react-hooks/rules-of-hooks */
import NoteTag from '@/components/note/NoteTag';
import SearchInput from '@/components/playground/SearchInput';
import fetcher from '@/lib/fetcher';
import { UserProfile, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { CodePlayground } from '@prisma/client';
import DashboardLayout from 'layouts/DashboardLayout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Fuse from 'fuse.js';
import Skeleton from 'react-loading-skeleton';
import Head from 'next/head';
import * as Checkbox from '@radix-ui/react-checkbox';
import { HiCheck } from 'react-icons/hi';
import TagPlaygroundViewer from '@/components/playground/TagPlaygroundViewer';
import searchTags from '@/lib/search-tags';
import getUniquePlaygroundTags from '@/lib/get-unique-playground-tags';
import getPlaygroundsDataByTags from '@/lib/get-playgrounds-data-by-tags';
import PlaygroundCard from '@/components/playground/PlaygroundCard';

const index: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { data: playgrounds } = useSWR<CodePlayground[]>(
    '/api/playground/get-all-playgrounds',
    fetcher
  );

  const [inputValue, setInputValue] = useState('');
  const [isSortedBasedOnTagsChecked, setIsSortedBasedOnTagsChecked] =
    useState<boolean>(false);

  useEffect(() => {
    setIsSortedBasedOnTagsChecked(
      JSON.parse(localStorage.getItem('isPlaygroundsSorted')) || false
    );
  }, []);

  const fuse = new Fuse(playgrounds, {
    keys: ['playgroundName', 'html', 'css', 'js'],
    includeMatches: true,
    useExtendedSearch: true,
  });

  const results = inputValue ? fuse.search(inputValue) : playgrounds;

  const searchedPlaygrounds = searchTags(
    getUniquePlaygroundTags(playgrounds),
    inputValue
  );

  return (
    <div>
      <Head>
        <title>{user.name || user.nickname}&apos;s Code playgrounds</title>
      </Head>
      <DashboardLayout>
        <h1 className='mb-16 text-4xl font-extrabold text-center'>
          Your HTML, CSS and JS Playgrounds 👨‍💻
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
                'isPlaygroundsSorted',
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
            {results?.map((playground) => (
              <PlaygroundCard
                playground={playground}
                key={playground?.id || playground?.item?.id}
              />
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
            {playgrounds ? (
              searchedPlaygrounds?.map((tag) => (
                <TagPlaygroundViewer
                  tag={tag}
                  playgroundsData={getPlaygroundsDataByTags(playgrounds, tag)}
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
