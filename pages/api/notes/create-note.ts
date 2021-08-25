import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import {
  getSession,
  withApiAuthRequired,
  UserProfile,
} from '@auth0/nextjs-auth0';
import { defaultNoteContent } from '@/components/note/defaultNoteContent';
import getTagsFromString from '@/lib/get-tags-from-string';
import { customAlphabet } from 'nanoid';
import generateDefaultContent from '@/lib/generate-default-content';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    user: { sub, name, email },
  }: { user: UserProfile } = getSession(req, res);
  const { body } = req;
  const alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-';
  const nanoid = customAlphabet(alphabet, 10);
  const { noteDescription, noteHeading, tags } = body;
  const newNote = await prisma.notes.create({
    data: {
      createdBy: sub,
      note: generateDefaultContent(name, email),
      noteDescription: noteDescription,
      noteHeading: noteHeading,
      tags: getTagsFromString(tags),
      publicId: nanoid(),
      emoji: '⚡️',
    },
  });
  res.json(newNote);
};

export default withApiAuthRequired(handler);
