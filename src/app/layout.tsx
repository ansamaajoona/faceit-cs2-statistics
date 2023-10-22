import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FACEIT CS2 statistics',
  description: 'A website where you can view advanced statistic about your FACEIT CS2 matches. Inspired by "faceit-stats.me".',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} bg-zinc-900 flex flex-col h-full`}>
        <div className="flex-grow">
          {children}
        </div>
        <footer className="bg-zinc-800 h-24 mt-8">
          <div className="flex justify-center w-full h-full">

            <div className="flex lg:flex-row flex-col items-center w-full lg:mx-8 lg:my-0 my-2 justify-between">

                <span className="text-stone-300 text-xs font-sans">
                  Not affiliated with or endorsed by FACEIT or other rightsholders.
                  Any trademarks used belong to their respective owners.
                </span>

                <div className="flex lg:flex-col text-stone-300 text-xs font-sans">
                  <span>Source available at <a href="https://github.com/ansamaajoona/faceit-cs2-statistics" target="_blank" className="hover:underline">github.com</a></span>
                  <span>Inspired by <a href="https://www.faceit-stats.me/" target="_blank" className="hover:underline">faceit-stats.me</a></span>
                </div>

            </div>

          </div>
        </footer>
      </body>
    </html>
  );
  
}
