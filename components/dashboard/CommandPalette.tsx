import CommandPalette from 'react-command-palette';
import useSWR from 'swr';
import { stripHtml } from 'string-strip-html';
import usePrefetch from '@/lib/usePrefetch';

const Page = () => {
  const { data } = useSWR<{ name: string; url: string }[]>(
    '/api/get-cmd-palette-data',
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  let commandPaletteData = data || [{ name: 'Loading...', url: '#' }];

  const router = usePrefetch([
    '/app/',
    '/app/notes',
    '/app/sticky-notes',
    '/app/todo',
    '/app/whiteboard',
    '/app/playgrounds',
    '/app/trash',
    // filter out urls that start with /app/playgrounds/
  ]);

  const p = (path) => router.push(path);
  const commands = [
    {
      name: 'Home',
      command() {
        p('/app/');
      },
    },
    {
      name: 'Notes',
      command() {
        p('/app/notes');
      },
    },
    {
      name: 'Sticky Notes',
      command() {
        p('/app/sticky-notes');
      },
    },
    {
      name: 'Todolists',
      command() {
        p('/app/todo');
      },
    },
    {
      name: 'Whiteboards',
      command() {
        p('/app/whiteboard');
      },
    },
    {
      name: 'HTML, CSS, JS Playgrounds',
      command() {
        p('/app/playgrounds');
      },
    },
    {
      name: 'Trash',
      command() {
        p('/app/trash');
      },
    },
    ...commandPaletteData?.map((item) => ({
      name: item?.name,
      command() {
        p(item?.url);
      },
    })),
  ];

  return (
    <div className=''>
      <CommandPalette
        commands={commands}
        open={false}
        hotKeys={['command+shift+p', 'ctrl+shift+p']}
        placeholder='Search for everything you have on Paperclip 🤯'
        trigger='Command Palette'
        closeOnSelect
        resetInputOnOpen
        getSuggestionValue={(value) => {
          return stripHtml(value.name).result.replace(/\.\.\./g, ' ... ');
        }}
        theme={{
          modal:
            'max-w-3xl bg-white border-2 border-gray-300 mx-auto mt-[25vh] rounded shadow-2xl max-h-[300px] overflow-y-scroll',
          suggestion:
            'text-gray-900 text-base px-4 py-2 border-b border-gray-200',
          input:
            'w-full m-0 px-4 py-3 focus:outline-none border-b border-gray-400 sticky top-0',
          suggestionHighlighted: 'bg-gray-50',
        }}
      />
    </div>
  );
};

export default Page;
