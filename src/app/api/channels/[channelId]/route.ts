import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const guildId = searchParams.get("guildId");

        if (!profile) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        if (!guildId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }

        if (!params.channelId) {
            return new NextResponse("Channel ID missing", { status: 400 });
        }

        const guild = await db.guild.update({
            where: {
                id: guildId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        },
                    },
                },
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "general",
                        },
                    },
                },
            },
        });

        return NextResponse.json(guild);
    } catch (error: any) {
        console.log("[CHANNEL_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}