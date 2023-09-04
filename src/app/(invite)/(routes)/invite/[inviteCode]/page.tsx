import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
};

const InviteCodePage = async ({
    params
}: InviteCodePageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    if (!params.inviteCode) {
        return redirect("/");
    }

    const existingGuild = await db.guild.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (existingGuild) {
        return redirect(`/guilds/${existingGuild.id}`);
    }

    const guild = await db.guild.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                    }
                ]
            }
        }
    })

    if (guild) {
        return redirect(`/guilds/${guild.id}`)
    }

    return null;
}

export default InviteCodePage;