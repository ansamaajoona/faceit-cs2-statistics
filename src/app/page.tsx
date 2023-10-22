'use client'
import { FormEventHandler } from "react";
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const extractUsername = (url: string): string | null => {
    const regex = /\/players\/([^/]+)/;
    const match = url.match(regex);

    if(match && match[1]) {
      return match[1];
    }

    return null;
  }

  interface Form extends HTMLFormElement {
    user: HTMLInputElement;
  }

  const handleSubmit: FormEventHandler<Form> = (e) => {
    e.preventDefault();
    const user = e.currentTarget.user.value;

    if(user.includes('http://') || user.includes('https://')) {
      const extractedUsername = extractUsername(user) || user;
      router.push(`/player?n=${extractedUsername}`);
    } else {
      router.push(`/player?n=${user}`);
    }
  }

  return (
    <main className="flex flex-col items-center">
      <div className="flex flex-col bg-zinc-800 lg:w-1/2 w-full h-auto mt-12 rounded-md shadow-xl">
        <div className="flex flex-col p-4">
            <h1 className="text-white font-xl font-bold font-sans pb-2">Enter FACEIT username or profile link</h1>
            <form className="flex lg:flex-row flex-col justify-between" onSubmit={handleSubmit}>
              <input type="text" id="user" autoComplete="off" placeholder="cAsE sEnSitIvE" className="lg:my-0 my-2 py-1 px-2 bg-zinc-700 rounded text-white w-full focus:outline-none" />
              <input type="submit" name="search" value="Search" className="lg:my-0 my-2 bg-zinc-700 rounded text-white w-full lg:w-2/12 lg:ml-2 hover:bg-zinc-600 hover:cursor-pointer" />
            </form>
        </div>
      </div>

      {/* TODO: */}
      {/* <div className="flex flex-col bg-zinc-800 lg:w-1/2 w-full h-auto mt-12 rounded-md shadow-xl">
        <div className="flex p-4">
          <h1 className="text-white font-xl font-bold font-sans pb-2">
            About this site
          </h1>
        </div>
      </div> */}
    </main>
  )
}
