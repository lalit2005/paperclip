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
  const playground = await prisma.codePlayground.update({
    where: {
      id: req.query.playgroundId.toString(),
    },
    data: {
      html: req.body.html,
      css: req.body.css,
      js: req.body.js,
    },
  });
  res.json(playground);
};

export default withApiAuthRequired(handler);
