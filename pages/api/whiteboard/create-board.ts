import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import {
  getSession,
  withApiAuthRequired,
  UserProfile,
} from '@auth0/nextjs-auth0';
import getTagsFromString from '@/lib/get-tags-from-string';
import { customAlphabet } from 'nanoid';
import getNewWhiteboardUrl from '@/lib/get-new-whiteboard-url';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    user: { sub, name, email },
  }: { user: UserProfile } = getSession(req, res);
  const { body } = req;
  const { boardDescription, boardName, tags } = body;
  const newNote = await prisma.whiteboards.create({
    data: {
      createdBy: sub,
      boardUrl: getNewWhiteboardUrl(),
      boardDescription: boardDescription,
      boardName: boardName,
      tags: getTagsFromString(tags),
    },
  });
  res.json(newNote);
};

export default withApiAuthRequired(handler);
