import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url);

        const guildId = searchParams.get("guildId");

        if (!profile) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        if (!guildId) {
            return new NextResponse("Guild ID missing", { status: 400 });
        }

        if (name === "general") {
            return new NextResponse("Name cannot be 'general'", { status: 400 });
        }

        const guild = await db.guild.update({
            where: {
                id: guildId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.MODERATOR, MemberRole.ADMIN],
                        },
                    },
                },
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type,
                    },
                },
            },
        });

        return NextResponse.json(guild);
    } catch (error: any) {
        console.log("[CHANNELS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}