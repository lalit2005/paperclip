import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
import prisma from '@/utils/prisma';
import {
  getSession,
  withApiAuthRequired,
  UserProfile,
} from '@auth0/nextjs-auth0';
import getTagsFromString from '@/lib/get-tags-from-string';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  const { boardName, noteDescription, tags, id } = body;
  const newNote = await prisma.whiteboards.update({
    where: {
      id,
    },
    data: {
      boardName: boardName,
      boardDescription: noteDescription,
      tags: tags,
    },
  });
  res.json(newNote);
};

export default withApiAuthRequired(handler);
