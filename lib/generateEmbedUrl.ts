const generateEmbedUrl = (url: string) => {
  if (new URL(url).hostname === 'www.youtube.com') {
    const params = new URL(url).searchParams
    return `https://www.youtube-nocookie.com/embed/${params.get('v')}`
  }

  if (new URL(url).hostname === 'twitter.com' || 'www.twitter.com') {
    return `https://twitframe.com/show?url=${url}`
  }
  return url
}

export default generateEmbedUrl
