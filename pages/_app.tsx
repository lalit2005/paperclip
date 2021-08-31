import { AppProps } from 'next/app';
import '@/styles/globals.css';
import '@/styles/notes.css';
import { UserProvider } from '@auth0/nextjs-auth0';
import { NextSeo } from 'next-seo';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <NextSeo
        title='Paperclip'
        description='The ultimate productivity tool you will ever need. From notes, whiteboards to code playgrounds, Paperclip will be your ultimate workstation'
        openGraph={{
          url: 'https://staticshield.vercel.app',
          title: 'Paperclip',
          description:
            'The ultimate productivity tool you will ever need. From notes, whiteboards to code playgrounds, Paperclip will be your ultimate workstation',
          images: [
            {
              url: 'https://usepaperclip.vercel.app/ogimage.png',
            },
          ],
          site_name: 'Paperclip',
        }}
        twitter={{
          handle: '@lalitcodes',
          cardType: 'summary_large_image',
        }}
      />
      <Component {...pageProps} />
    </UserProvider>
  );
}
