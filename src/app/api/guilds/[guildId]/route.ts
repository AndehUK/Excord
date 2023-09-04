import { NextResponse } from "next/server"

import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { guildId: string } }
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        const guild = await db.guild.delete({
            where: { id: params.guildId, profileId: profile.id },
        })

        return NextResponse.json(guild);
    } catch (error: any) {
        console.log("[GUILD_ID_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { guildId: string } }
) {
    try {
        const profile = await currentProfile();
        const { name, imageUrl } = await req.json();

        if (!profile) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        const guild = await db.guild.update({
            where: { id: params.guildId, profileId: profile.id },
            data: {
                name,
                imageUrl
            }
        })

        return NextResponse.json(guild);
    } catch (error: any) {
        console.log("[GUILD_ID_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}