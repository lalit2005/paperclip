import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import {
  withApiAuthRequired,
  UserProfile,
  getSession,
} from '@auth0/nextjs-auth0';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    user: { sub },
  }: { user: UserProfile } = getSession(req, res);
  const trashNotesRequest = prisma.notes.findMany({
    where: {
      createdBy: sub,
      inTrash: true,
    },
  });
  const trashBoardsRequest = prisma.whiteboards.findMany({
    where: {
      createdBy: sub,
      inTrash: true,
    },
  });
  const [trashNotes, trashBoards] = await prisma.$transaction([
    trashNotesRequest,
    trashBoardsRequest,
  ]);
  res.json({
    notes: trashNotes,
    boards: trashBoards,
  });
};

export default withApiAuthRequired(handler);
