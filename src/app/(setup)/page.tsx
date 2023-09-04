import { redirect } from "next/navigation";

import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";

import { InitialModal } from "@/components/modals/initial-modal";

const SetupPage = async () => {
    const profile = await initialProfile();

    const guild = await db.guild.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (guild) {
        return redirect(`/guilds/${guild.id}`)
    }

    return <InitialModal />;
}

export default SetupPage;