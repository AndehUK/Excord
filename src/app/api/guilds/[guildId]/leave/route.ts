import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { guildId: string } }
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        if (!params.guildId) {
            return new NextResponse("Guild ID missing", { status: 401 });
        }

        const guild = await db.guild.update({
            where: {
                id: params.guildId,
                profileId: {
                    not: profile.id,
                },
                members: {
                    some: {
                        profileId: profile.id,
                    },
                },
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id,
                    },
                },
            },
        });

        return NextResponse.json(guild);
    } catch (error: any) {
        console.log("[GUILD_ID_LEAVE]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}