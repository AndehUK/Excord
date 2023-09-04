import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

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
            return new NextResponse("Guild ID Missing", { status: 400 });
        }

        const guild = await db.guild.update({
            where: { id: params.guildId, profileId: profile.id },
            data: {
                inviteCode: uuidv4(),
            },
        });

        return NextResponse.json(guild);
    } catch (error: any) {
        console.log("[GUILD_ID]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}