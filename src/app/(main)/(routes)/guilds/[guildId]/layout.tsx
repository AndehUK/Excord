import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { GuildSidebar } from "@/components/guild/guild-sidebar";

const GuildIdLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode,
    params: { guildId: string };
}) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const guild = await db.guild.findUnique({
        where: {
            id: params.guildId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (!guild) {
        return redirect("/")
    }

    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <GuildSidebar guildId={params.guildId} />
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    );
}

export default GuildIdLayout;