import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import {
  getSession,
  withApiAuthRequired,
  UserProfile,
} from '@auth0/nextjs-auth0';

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

  const [
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

  const response: {
    name: string;
    url: string;
  }[] = [
    ...notes.map(({ noteHeading, id }) => ({
      name: noteHeading,
      url: `/app/notes/${id}`,
    })),
    ...notesContent.map(({ note, id }) => ({
      name: note,
      url: `/app/notes/${id}`,
    })),
    ...notesDesc.map(({ noteDescription, id }) => ({
      name: noteDescription,
      url: `/app/notes/${id}`,
    })),
    ...stickyNotes.map(({ stickyNote, id }) => ({
      name: stickyNote,
      url: `/app/sticky-notes`,
    })),
    ...boards.map(({ boardName, id }) => ({
      name: boardName,
      url: `/app/whiteboard/${id}`,
    })),
    ...todos.map(({ todo, todolist }) => ({
      name: todo,
      url: `/app/todo/${todolist.id}`,
    })),
    ...todolists.map(({ id, todolistName }) => ({
      name: todolistName,
      url: `/app/todo/${id}`,
    })),
    ...playgrounds.map(({ playgroundName, id }) => ({
      name: playgroundName,
      url: `/app/playgrounds/${id}`,
    })),
  ];

  res.json(response);
};

export default withApiAuthRequired(handler);
