import type { Metadata } from 'next'
import '@/app/globals.scss';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import Header from '@/app/components/Header';
import { Nunito_Sans } from 'next/font/google'
import { AuthContextProvider } from '@/app/contexts/AuthContext';


const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  preload: true,
})


export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={nunitoSans.className + ' text-ebony'}>
        <AuthContextProvider>
            <Header />
            <main className='flex'>
              {children}
            </main >
        </AuthContextProvider>

      </body>
    </html>

  )
}
