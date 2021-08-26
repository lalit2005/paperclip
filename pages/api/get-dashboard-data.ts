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
      emoji: true,
      id: true,
    },
    take: 4,
  });
  const stickyNotesFetcher = prisma.stickyNotes.findMany({
    where: {
      createdBy: sub,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 4,
  });
  const boardsFetcher = prisma.whiteboards.findMany({
    where: {
      createdBy: sub,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 4,
  });

  const todolistsFetcher = prisma.todos.findMany({
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
    take: 4,
  });

  const playgroundsFetcher = prisma.codePlayground.findMany({
    where: {
      createdBy: sub,
      inTrash: false,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 4,
  });

  const [notes, stickyNotes, boards, todolists, playgrounds] =
    await prisma.$transaction([
      notesFetcher,
      stickyNotesFetcher,
      boardsFetcher,
      todolistsFetcher,
      playgroundsFetcher,
    ]);

  res.json({
    notes,
    stickyNotes,
    boards,
    impTodos: todolists,
    playgrounds,
  });
};

export default withApiAuthRequired(handler);
