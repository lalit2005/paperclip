import CommandPalette from 'react-command-palette';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const Page = () => {
  const router = useRouter();
  const { data } = useSWR<{ name: string; url: string }[]>(
    '/api/get-cmd-palette-data'
  );
  let commandPaletteData = data || [{ name: 'Loading...', url: '#' }];
  const p = (path) => router.push(path);
  const commands = [
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
    ...commandPaletteData?.map((item) => ({
      name: item?.name,
      command() {
        p(item?.url);
      },
    })),
  ];

  return (
    <div>
      <CommandPalette
        commands={commands}
        open={false}
        trigger='Command Palette'
        closeOnSelect={true}
        maxDisplayItems={500}
      />
    </div>
  );
};

export default Page;
