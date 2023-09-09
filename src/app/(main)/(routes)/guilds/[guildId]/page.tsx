import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface GuildIdPageProps {
    params: {
        guildId: string;
    }
};

const GuildIdPage = async ({
    params
}: GuildIdPageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const guild = await db.guild.findUnique({
        where: {
            id: params.guildId,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
        include: {
            channels: {
                where: {
                    name: "general",
                },
                orderBy: {
                    createdAt: "asc",
                }
            },
        },
    });

    const initialChannel = guild?.channels[0];

    if (initialChannel?.name !== "general") {
        return null;
    }

    return redirect(`/guilds/${params.guildId}/channels/${initialChannel?.id}`)
}

export default GuildIdPage;