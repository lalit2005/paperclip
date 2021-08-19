import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  const response = await fetch('https://api.github.com/emojis')
  const emojis = await response.json()

  // 2592000 seconds = 30 days
  res.setHeader('Cache-Control', 's-maxage=2592000')
  res.json(emojis)
}

export default handler
