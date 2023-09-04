import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { memberId: string } }
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

        if (!params.memberId) {
            return new NextResponse("Member ID missing", { status: 400 });
        }

        const guild = await db.guild.update({
            where: {
                id: guildId,
                profileId: profile.id,
            },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id,
                        },
                    },
                },
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    },
                },
            },
        });

        return NextResponse.json(guild);
    } catch (error: any) {
        console.log("[MEMBER_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { memberId: string } }
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const { role } = await req.json();

        const guildId = searchParams.get("guildId");

        if (!profile) {
            return new NextResponse("Unauthorised", { status: 401 });
        }

        if (!guildId) {
            return new NextResponse("Guild ID missing", { status: 400 })
        }

        if (!params.memberId) {
            return new NextResponse("Member ID missing", { status: 400 })
        }

        const guild = await db.guild.update({
            where: {
                id: guildId,
                profileId: profile.id,
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id,
                            },
                        },
                        data: {
                            role,
                        }
                    },
                },
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    }
                }
            }
        });

        return NextResponse.json(guild);
    } catch (error: any) {
        console.log("[MEMBERS_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}