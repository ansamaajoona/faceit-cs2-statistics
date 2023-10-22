import Link from 'next/link'

export default function NotFound() {
    return (
        <main className="flex flex-col items-center">
            <div className="flex flex-col bg-zinc-800 w-full lg:w-1/2 h-auto mt-12 rounded-md shadow-xl p-6">
                <h1 className="text-white text-4xl font-mono font-extrabold mb-2">Error 404</h1>
                <h2 className="text-white text-2xl font-semibold">The page you were looking for cannot be found</h2>
                <a href="/" className="mt-12 text-gray-300 text-sm hover:underline hover:text-white">Return back</a>

            </div>
        </main>
    )
}