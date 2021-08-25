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
  const { playgroundName, tags, id } = body;
  const newNote = await prisma.codePlayground.update({
    where: {
      id,
    },
    data: {
      playgroundName: playgroundName,
      tags: getTagsFromString(tags),
    },
  });
  res.json(newNote);
};

export default withApiAuthRequired(handler);
