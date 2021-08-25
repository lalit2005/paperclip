import useSWR from 'swr';
import fetcher from '@/lib/fetcher';
import Skeleton from 'react-loading-skeleton';
import EmojiSet from 'emoji-set';

const Picker = ({ emoji, setEmoji }) => {
  // const { data } = useSWR('/api/emojis', fetcher)
  // const emojis = Object.keys(data || {}).map((key) => data[key])
  const emojis = EmojiSet.getAll(true);
  console.log(emojis);
  return (
    <div className='flex flex-wrap w-full max-w-sm px-2 py-3 overflow-y-scroll bg-white border border-gray-600 rounded shadow-xl h-60 '>
      {emojis.map((emoji) => {
        return (
          <button
            key={emoji}
            onClick={() => setEmoji(emoji)}
            className='p-2 m-1 rounded-sm hover:bg-gray-100'>
            {emoji}
          </button>
        );
      }) || <Skeleton width={24} height={24} count={1878} />}
    </div>
  );
};

export default Picker;
