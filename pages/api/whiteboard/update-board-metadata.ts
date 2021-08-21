import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/utils/prisma'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req
  const { boardName, boardDescription, id } = body
  const newNote = await prisma.whiteboards.update({
    where: {
      id,
    },
    data: {
      boardName,
      boardDescription,
    },
  })
  res.json(newNote)
}

export default withApiAuthRequired(handler)
