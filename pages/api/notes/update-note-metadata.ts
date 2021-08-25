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
  const { noteHeading, noteDescription, tags, id, emoji } = body;
  const newNote = await prisma.notes.update({
    where: {
      id,
    },
    data: {
      noteHeading: noteHeading,
      noteDescription: noteDescription,
      tags: getTagsFromString(tags),
      emoji: emoji,
    },
  });
  res.json(newNote);
};

// export const config: PageConfig = {
//   api: {
//     bodyParser: {
//       sizeLimit: '10mb',
//     },
//   },
// }

export default withApiAuthRequired(handler);
