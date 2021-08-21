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
  let { elements, appState, id } = body;
  delete appState.collaborators;
  const newNote = await prisma.whiteboards.update({
    where: {
      id,
    },
    data: {
      elements: JSON.stringify(elements),
      appState: JSON.stringify(appState),
    },
  });
  console.log(newNote);
  res.json(newNote);
};

export const config: PageConfig = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default withApiAuthRequired(handler);
