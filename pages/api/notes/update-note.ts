import { NextApiRequest, NextApiResponse, PageConfig } from 'next';
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
  const { body } = req;
  const { noteContent, id } = body;
  const newNote = await prisma.notes.update({
    where: {
      id,
    },
    data: {
      note: noteContent,
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
