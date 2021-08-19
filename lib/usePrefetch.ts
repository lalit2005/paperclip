import { useRouter } from 'next/router'
import { useEffect } from 'react'

const usePrefetch = (path: string) => {
  const router = useRouter()
  useEffect(() => {
    router.prefetch(path)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return router
}

export default usePrefetch
