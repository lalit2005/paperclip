import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import {
  getSession,
  withApiAuthRequired,
  UserProfile,
} from '@auth0/nextjs-auth0';
import { stripHtml } from 'string-strip-html';
import truncate from 'lodash.truncate';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    user: { sub },
  }: { user: UserProfile } = getSession(req, res);
  const notesFetcher = prisma.notes.findMany({
    where: {
      createdBy: sub,
      inTrash: false,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      noteHeading: true,
      id: true,
    },
  });
  const notesContentFetcher = prisma.notes.findMany({
    where: {
      createdBy: sub,
      inTrash: false,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      note: true,
      noteHeading: true,
      id: true,
    },
  });

  const notesDescFetcher = prisma.notes.findMany({
    where: {
      createdBy: sub,
      inTrash: false,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      noteDescription: true,
      noteHeading: true,
      id: true,
    },
  });

  const stickyNotesFetcher = prisma.stickyNotes.findMany({
    where: {
      createdBy: sub,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      stickyNote: true,
      id: true,
    },
  });
  const boardsFetcher = prisma.whiteboards.findMany({
    where: {
      createdBy: sub,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      boardName: true,
      id: true,
    },
  });

  const todosFetcher = prisma.todos.findMany({
    where: {
      todolist: {
        createdBy: sub,
        inTrash: false,
      },
      isDone: false,
    },
    orderBy: {
      priority: 'desc',
    },
    select: {
      todo: true,
      todolist: {
        select: {
          id: true,
          todolistName: true,
        },
      },
    },
  });

  const todolistsFetcher = prisma.todolists.findMany({
    where: {
      createdBy: sub,
      inTrash: false,
    },
    select: {
      todolistName: true,
      id: true,
    },
  });

  const playgroundsFetcher = prisma.codePlayground.findMany({
    where: {
      createdBy: sub,
      inTrash: false,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      playgroundName: true,
      id: true,
    },
  });

  let [
    notes,
    notesContent,
    notesDesc,
    stickyNotes,
    boards,
    todos,
    todolists,
    playgrounds,
  ] = await prisma.$transaction([
    notesFetcher,
    notesContentFetcher,
    notesDescFetcher,
    stickyNotesFetcher,
    boardsFetcher,
    todosFetcher,
    todolistsFetcher,
    playgroundsFetcher,
  ]);
  console.log(notesContent);

  if (notesContent && notesContent.length > 0) {
    // break note content into chunks of 70 characters
    notesContent = notesContent?.map((note) => {
      let content = note?.note;
      let chunks: {
        id: string;
        note: string;
        noteHeading: string;
      }[] = [];
      while (content.length > 0) {
        chunks.push({
          note:
            '...' +
            stripHtml(content?.substr(0, 70), {
              ignoreTags: ['pre'],
              dumpLinkHrefsNearby: {
                enabled: true,
                putOnNewLine: false,
                wrapHeads: '(',
                wrapTails: ')',
              },
            }).result +
            '...',
          id: note?.id,
          noteHeading: note?.noteHeading,
        });
        content = content?.substr(70);
      }
      return chunks;
    })[0];
  }

  console.log(notesContent);
  const response: {
    name: string;
    url: string;
  }[] = [
    ...notes?.map(({ noteHeading, id }) => ({
      name:
        '<span style="background-color: #DBEAFE; padding: 2px; border-radius: 2px;">Note:</span> ' +
        noteHeading,
      url: `/app/notes/${id}`,
    })),
    ...notesContent?.map(({ noteHeading, note, id }) => ({
      name:
        `<span style="background-color: #DBEAFE; padding: 2px; border-radius: 2px;">${noteHeading}:</span> ` +
        note,
      url: `/app/notes/${id}`,
    })),
    ...notesDesc?.map(({ noteDescription, id, noteHeading }) => ({
      name:
        `<span style="background-color: #DBEAFE; padding: 2px; border-radius: 2px;">${noteHeading}:</span> ` +
        noteDescription,
      url: `/app/notes/${id}`,
    })),
    ...stickyNotes?.map(({ stickyNote, id }) => ({
      name:
        '<span style="background-color: #FEE2E2; padding: 2px; border-radius: 2px;">Sticky note:</span> ' +
        truncate(stickyNote, { length: 200 }),
      url: `/app/sticky-notes`,
    })),
    ...boards?.map(({ boardName, id }) => ({
      name:
        '<span style="background-color: #FEF3C7; padding: 2px; border-radius: 2px;">Whiteboard:</span> ' +
        boardName,
      url: `/app/whiteboard/${id}`,
    })),
    ...todos?.map(({ todo, todolist }) => ({
      name:
        `<span style="background-color: #D1FAE5; padding: 2px; border-radius: 2px;">${todolist.todolistName}:</span> ` +
        todo,
      url: `/app/todo/${todolist.id}`,
    })),
    ...todolists?.map(({ id, todolistName }) => ({
      name:
        '<span style="background-color: #D1FAE5; padding: 2px; border-radius: 2px;">Todo list:</span> ' +
        todolistName,
      url: `/app/todo/${id}`,
    })),
    ...playgrounds?.map(({ playgroundName, id }) => ({
      name:
        '<span style="background-color: #E0E7FF; padding: 2px; border-radius: 2px;">Playground:</span> ' +
        playgroundName,
      // playground proxy to avoid prefetching the playground because editor.contentWindow.postMessage does not work
      url: `/app/playground-proxy/${id}/?reload=yes`,
    })),
  ];

  res.json(response);
};

export default withApiAuthRequired(handler);
