import { AppProps } from 'next/app'
import '@/styles/globals.css'
import '@/styles/notes.css'
import { UserProvider } from '@auth0/nextjs-auth0'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}
