'use client'
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import LevelLogo from '../LevelLogo';
import Image from 'next/image';

export default function Player() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const name = searchParams.get('n');

    interface IData {
        code: number,
        message: string,
        data: {
            player: {
                player_id: string,
                nickname: string,
                avatar: string,
                country: string,
                cover_image: string,
                platforms: object,
                steam_url: string,
                memberships: string[],
                faceit_url: string,
                infractions: object,
                verified: boolean,
                activated_at: string,
                skill_level: number,
                elo: number,
            },
            matches: object[],
            lifetime_statistics: {
                avg_headshot_percent: string
                current_win_streak: string,
                avg_kd_ratio: string,
                matches: string,
                total_headshots: string,
                win_rate: string,
                recent_results: string[],
                total_wins: string,
                longest_win_streak: string,
            },
        }
    }

    interface IState {
        loading: boolean,
        error?: {
            code: number,
            message: string
        }
    }

    const [data, setData] = useState<IData | null>(null);
    const [state, setState] = useState<IState | null>(null);

    useEffect(() => {
        if (!name) {
            router.replace('/');
        } else {
            setState({ loading: true });

            fetch(`/api/player?n=${name}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.code !== 200) {
                        setState({
                            loading: false,
                            error: {
                                code: data.code,
                                message: data.message,
                            },
                        });
                    } else {
                        setState({ loading: false });
                        setData(data);
                    }
                });
        }
    }, [name, router]);

    const formatIsoDate = (isoString: string | undefined, includeHours: boolean): string => {
        if (isoString === undefined) {
            return 'Invalid Date';
        }
    
        const date = new Date(isoString);
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'Europe/Helsinki',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        };
    
        if (includeHours) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
    
        const dateFormatter = new Intl.DateTimeFormat('en-GB', options);
    
        return dateFormatter.format(date);
    };


    const handleMatchClick = (id: string) => {
        window.open(`https://www.faceit.com/en/cs2/room/${id}/scoreboard`, '_blank');
    }


    if(state !== null && state.loading) {
        return (
            <main className="flex flex-col items-center">
                <div className="flex flex-col bg-zinc-800 w-full lg:w-1/2 h-auto mt-12 rounded-md shadow-xl">
                    <div className="flex h-auto">
                        <div className="w-1/5 p-4">
                            <div className="animate-pulse bg-zinc-600 w-36 h-36 rounded-full"></div>
                        </div>
                        <div className="w-4/5">
                            <div className="flex py-6 px-6 justify-between h-full">
                                <div className="flex flex-col justify-center">
                                    <div className="flex">
                                        <div className="animate-pulse bg-zinc-600 w-20 h-8 rounded-md mb-1"></div>
                                    </div>
                                    <div className="flex">
                                        <div className="animate-pulse bg-zinc-600 w-40 h-6 rounded-md"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex">
                                        <div className="animate-pulse bg-zinc-600 w-10 h-10 m-1 rounded-md"></div>
                                        <div className="animate-pulse bg-zinc-600 w-10 h-10 m-1 rounded-md"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col bg-zinc-800 w-full lg:w-1/2 h-auto mt-12 rounded-md shadow-xl">
                    <div className="flex p-4">
                        <h1 className="text-white text-xl font-bold font-sans pb-2">Lifetime statistics</h1>
                    </div>
                    <div className="container mx-auto pb-2">

                        <div className="grid lg:grid-cols-3 grid-cols-2 gap-4">
                            {Array.from({ length: 9 }).map((_, index) => (
                                <div key={index} className="flex flex-col px-4 py-2">
                                    <div className="animate-pulse bg-zinc-600 w-48 h-8 rounded"></div>
                                    <div className="animate-pulse bg-zinc-600 w-48 h-6 rounded mt-1"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col bg-zinc-800 w-full lg:w-1/2 h-auto mt-12 rounded-md shadow-xl">
                    <div className="flex p-4">
                        <h1 className="text-white text-xl font-bold font-sans pb-2">Last {data?.data.matches.length} matches</h1>
                    </div>
                    <div className="flex flex-col px-2">
                        <div className="animate-pulse bg-zinc-600 my-2 py-2 px-1 rounded h-12"></div>
                        <div className="animate-pulse bg-zinc-600 my-2 py-2 px-1 rounded h-12"></div>
                        <div className="animate-pulse bg-zinc-600 my-2 py-2 px-1 rounded h-12"></div>
                    </div>
                </div>
            </main>
        );
    }

    if(state !== null && state.error) {
        return (
            <main className="flex flex-col items-center">
                <div className="flex flex-col bg-zinc-800 w-full lg:w-1/2 h-auto mt-12 rounded-md shadow-xl p-6">
                    <h1 className="text-white text-4xl font-mono font-extrabold mb-2">Error {state.error.code}</h1>
                    <h2 className="text-white text-2xl font-semibold">{state.error.message}</h2>

                    { state.error.code !== 404 && 
                        <h3 className="mt-12 text-gray-300 text-sm">If you&apos;re seeing this error message too often, <a href="https://github.com/ansamaajoona/portfolio/issues/new" target="_blank" className="underline hover:text-white">please let me know.</a></h3>
                    }
                </div>
            </main>
        )
    }

    return (
        <main className="flex flex-col items-center">
            <div className="flex flex-col bg-zinc-800 w-full lg:w-1/2 h-auto mt-12 rounded-md shadow-xl">

                {/* container for user data */}
                <div className="flex h-auto">

                    {/* avatar container */}
                    <div className="w-1/5">
                        <Image alt="avatar" src={data?.data.player.avatar as string} className="h-full w-full rounded-full p-5 aspect-square"  width={100} height={100} />
                    </div>

                    {/* user data */}
                    <div className="w-4/5">
                        <div className="flex py-6 px-6 justify-between h-full">

                            <div className="flex flex-col justify-center">
                                <div className="flex">
                                    <h1 className="text-neutral-100 font-bold text-2xl">{data?.data.player.nickname}</h1>
                                    {data?.data.player.memberships.map((item: any, index: number) => (
                                        <span key={index} className="text-neutral-200 font-bold text-sm p-1">({item})</span>
                                    ))}
                                </div>
                                <div className="flex">
                                    <h2 className="text-neutral-200 font-semibold text-sm">Member since {formatIsoDate(data?.data.player.activated_at, false)}</h2>
                                </div>

                            </div>

                            <div className="flex flex-col">
                                
                                {/* icons */}
                                <div className="flex">
                                    <a href={data?.data.player.faceit_url.replace('{lang}', 'en')} target="_blank" className="bg-zinc-600 text-md h-10 m-1 rounded-md shadow-md">
                                        <Image alt="faceit" src="./faceit.svg" className="h-full w-full bg-transparent" width={100} height={100}/>
                                    </a>
                                    <a href={data?.data.player.steam_url} target="_blank" className="bg-zinc-600 text-md h-10 m-1 rounded-md shadow-md">
                                        <Image alt="steam" src="./steam.svg" className="h-full w-full bg-transparent"  width={100} height={100}/>
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <div className="flex flex-col bg-zinc-800 w-full lg:w-1/2 h-auto mt-12 rounded-md shadow-xl">
                <div className="flex p-4">
                    <h1 className="text-white text-xl font-bold font-sans pb-2">Lifetime statistics</h1>
                </div>
                <div className="container mx-auto pb-2">
                    <div className="flex  p-2">
                        <LevelLogo level={data?.data.player.skill_level} className="aspect-square h-16" />
                        <div className="flex flex-col px-2 py-1 justify-center">
                            <span className="text-white text-xl bg-zinc-700 p-2 rounded">ELO {data?.data.player.elo}</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 grid-cols-2 gap-4">

                        <div className="flex flex-col px-4 py-2">
                            <span className="text-gray-200 font-semibold">Total matches:</span>
                            <span className="text-white">{data?.data.lifetime_statistics.matches}</span>
                        </div>
                        <div className="flex flex-col px-4 py-2">
                            <span className="text-gray-200 font-semibold">Win rate:</span>
                            <span className="text-white">{data?.data.lifetime_statistics.win_rate}</span>
                        </div>
                        <div className="flex flex-col px-4 py-2">
                            <span className="text-gray-200 font-semibold">Recent results:</span>
                            <div className="flex flex-row">
                                {data?.data.lifetime_statistics.recent_results.map((item: string, index: number) => (
                                    item === "0" ? (
                                        <span key={index} className="text-red-500 font-bold pr-2">L</span>
                                    ) : (
                                        <span key={index} className="text-green-500 font-bold pr-2">W</span>
                                    )
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex flex-col px-4 py-2">
                            <span className="text-gray-200 font-semibold">Total wins:</span>
                            <span className="text-white">{data?.data.lifetime_statistics.total_wins}</span>
                        </div>
                        <div className="flex flex-col px-4 py-2">
                            <span className="text-gray-200 font-semibold">Longest winstreak:</span>
                            <span className="text-white">{data?.data.lifetime_statistics.longest_win_streak}</span>
                        </div>
                        <div className="flex flex-col px-4 py-2">
                            <span className="text-gray-200 font-semibold">Current winstreak:</span>
                            <span className="text-white">{data?.data.lifetime_statistics.current_win_streak}</span>
                        </div>
                        
                        <div className="flex flex-col px-4 py-2">
                            <span className="text-gray-200 font-semibold">Average headshots:</span>
                            <span className="text-white">{data?.data.lifetime_statistics.avg_headshot_percent}</span>
                        </div>
                        <div className="flex flex-col px-4 py-2">
                            <span className="text-gray-200 font-semibold">Total headshots:</span>
                            <span className="text-white">{data?.data.lifetime_statistics.total_headshots}</span>
                        </div>
                        <div className="flex flex-col px-4 py-2">
                            <span className="text-gray-200 font-semibold">Average K/D ratio:</span>
                            <span className="text-white">{data?.data.lifetime_statistics.avg_kd_ratio}</span>
                        </div>

                    </div>
                </div>
            </div>

            <div className="flex flex-col bg-zinc-800 w-full lg:w-1/2 h-auto mt-12 rounded-md shadow-xl">
                <div className="flex p-4">
                    <h1 className="text-white text-xl font-bold font-sans pb-2">Last {data?.data.matches.length} matches</h1>
                </div>
                <div className="flex flex-col px-2">
                    {data?.data.matches.map((item: any, index: number) => (
                        
                        // TODO: make accordion to see advanced statistics of each match instead of redirecting to match page.
                        <div key={index} onClick={() => handleMatchClick(item.stats['Match Id'])} className={
                            `flex items-center my-2 py-2 px-1 rounded hover:cursor-pointer ${item.stats['Result'] === '0' ? 'bg-red-500 hover:bg-red-400' : 'bg-green-500 hover:bg-green-400'}`
                        }>
                            <div className="flex justify-between w-full items-center">

                                <div className="flex w-1/2 items-center">
                                    <span className="bg-zinc-700 py-1 w-1/6 text-center mr-3 rounded-md text-gray-100 font-extrabold">
                                        {item.stats['Score']}
                                    </span>

                                    <span className="bg-zinc-700 py-1 mr-2 w-1/3 text-center rounded-md text-gray-100">
                                        {item.stats['Map']}
                                    </span>

                                    <span className="bg-zinc-700 py-1 w-1/3 text-center rounded-md text-gray-100">
                                        {formatIsoDate(item.stats['Created At'], true)}
                                    </span>
                                </div>

                                <div className="flex w-1/3 items-center">
                                    <div className="flex justify-around bg-zinc-700 py-1 w-full text-center rounded-md text-gray-100">
                                        <span>{item.stats['Kills']} - {item.stats['Assists']} - {item.stats['Deaths']}</span> <span>KD: {item.stats['K/D Ratio']}</span> <span>HS%: {item.stats['Headshots %']}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
