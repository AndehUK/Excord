import { currentProfile } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextAPIResposeServerIO } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextAPIResposeServerIO,
) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const profile = await currentProfile(req);
        const { content, fileUrl } = req.body;
        const { guildId, channelId } = req.query;

        if (!profile) {
            return res.status(401).json({ error: "Unauthorised" });
        }

        if (!guildId) {
            return res.status(400).json({ error: "Guild ID missing" });
        }

        if (!channelId) {
            return res.status(400).json({ error: "Channel ID missing" });
        }

        if (!content) {
            return res.status(400).json({ error: "Content missing" });
        }

        const guild = await db.guild.findFirst({
            where: {
                id: guildId as string,
                members: {
                    some: {
                        profileId: profile.id
                    },
                },
            },
            include: {
                members: true,
            },
        });

        if (!guild) {
            return res.status(404).json({ message: "Guild not found" });
        }

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                guildId: guildId as string,
            },
        });

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" })
        }

        const member = guild.members.find((member) => member.profileId === profile.id)

        if (!member) {
            return res.status(404).json({ message: "Member not found" })
        }

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        profile: true
                    },
                },
            },
        });

        const channelKey = `chat:${channelId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);
    } catch (error: any) {
        console.log("[MESSAGES_POST]", error);
        return res.status(500).json({ message: "Internal Error" });
    }
}