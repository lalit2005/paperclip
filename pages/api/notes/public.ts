import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  const { id, isNotePublic } = body;
  console.log(isNotePublic);
  const newNote = await prisma.notes.update({
    where: {
      id,
    },
    data: {
      isPublic: isNotePublic,
    },
  });
  res.json(newNote);
};

export default withApiAuthRequired(handler);
