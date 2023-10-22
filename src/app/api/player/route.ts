import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
'use api'
interface IResponse {
    code: number,
    message: string,
    data?: {
        player: {
            player_id: string,
            nickname: string,
            avatar: string,
            country: string,
            cover_image: string,
            platforms: object,
            memberships: object,
            faceit_url: string,
            infractions: object,
            verified: boolean,
            activated_at: string,
        },
        matches: object[]
    }
}

export async function GET(request: Request): Promise<NextResponse<IResponse>> {
    const { searchParams } = new URL(request.url)
    const nameParameter = searchParams.get('n')

    if(!nameParameter) {
        return NextResponse.json(
            {
                code: 400,
                message: 'Bad Request',
            }
        );
    }    

    try {

        const playerData = await axios(
            {
                method: 'GET',
                url: `https://open.faceit.com/data/v4/players?nickname=${nameParameter}`,
                headers: {
                    'Authorization': `Bearer ${process.env.FACEIT_API_KEY}`
                }
            }
        )

        const playerMatches = await axios(
            {
                method: 'GET',
                url: `https://open.faceit.com/data/v4/players/${playerData.data.player_id}/games/cs2/stats?offset=0&limit=50`,
                headers: {
                    'Authorization': `Bearer ${process.env.FACEIT_API_KEY}`
                }
            }
        )

        const playerLifetimeStatistics = await axios(
            {
                method: 'GET',
                url: `https://open.faceit.com/data/v4/players/${playerData.data.player_id}/stats/cs2`,
                headers: {
                    'Authorization': `Bearer ${process.env.FACEIT_API_KEY}`
                }
            }
        )

        // convert Steam ID to Community ID.
        const convertSteamIdToUrl = (id: string): string => {
            const regex = /STEAM_(\d+):(\d+):(\d+)/;
            const match = id.match(regex);
        
            if (match === null) {
                return 'Invalid ID';
            }
        
            const Y = parseInt(match[2], 10);
            const Z = parseInt(match[3], 10);
        
            const constantA = 76561197960265728;
            const constantB = 2;
        
            const communityId = BigInt(Z) * BigInt(constantB) + BigInt(constantA) + BigInt(Y);
        
            return `https://steamcommunity.com/profiles/${communityId.toString()}/`;
        };

        var returnData = {
            player: {
                player_id: playerData.data.player_id,
                nickname: playerData.data.nickname,
                avatar: playerData.data.avatar,
                country: playerData.data.country,
                cover_image: playerData.data.cover_image,
                platforms: playerData.data.platforms,
                steam_url: convertSteamIdToUrl(playerData.data.platforms['steam']),
                memberships: playerData.data.memberships,
                faceit_url: playerData.data.faceit_url,
                infractions: playerData.data.infractions,
                verified: playerData.data.verified,
                activated_at: playerData.data.activated_at,
                skill_level: playerData.data.games.cs2.skill_level,
                elo: playerData.data.games.cs2.faceit_elo,
            },
            lifetime_statistics: {
                avg_headshot_percent: playerLifetimeStatistics.data.lifetime['Average Headshots %'] + '%',
                current_win_streak: playerLifetimeStatistics.data.lifetime['Current Win Streak'],
                avg_kd_ratio: playerLifetimeStatistics.data.lifetime['Average K/D Ratio'],
                matches: playerLifetimeStatistics.data.lifetime['Matches'],
                total_headshots: playerLifetimeStatistics.data.lifetime['Total Headshots %'],
                win_rate: playerLifetimeStatistics.data.lifetime['Win Rate %'] + '%',
                recent_results: playerLifetimeStatistics.data.lifetime['Recent Results'],
                total_wins: playerLifetimeStatistics.data.lifetime['Wins'],
                longest_win_streak: playerLifetimeStatistics.data.lifetime['Longest Win Streak'],

            },
            matches: playerMatches.data.items
        }

        return NextResponse.json(
            {
                code: 200,
                message: 'Success',
                data: returnData
            }
        );

    } catch(error: any) {
        console.error(error)

        if(error.response.status === 404) {
            return NextResponse.json(
                {
                    code: 404,
                    message: 'Player could not be found.'
                }
            )
        }

        return NextResponse.json(
            {
                code: 500,
                message: 'An unexpected flaw happened on our end. Please try again later.'
            }
        )
    }

}