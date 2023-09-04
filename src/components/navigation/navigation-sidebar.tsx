import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NavigationAction } from "@/components/navigation/navigation-action";
import { NavigationItem } from "@/components/navigation/navigation-item";
import { ThemeToggle } from "@/components/theme-toggler";
import { UserButton } from "@clerk/nextjs";

export const NavigationSidebar = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return redirect("/");
    }

    const guilds = await db.guild.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    return (
        <div
            className="space-y-4 flex flex-col items-center h-full text-primary w-full py-3 bg-[#E3E5E8] dark:bg-[#1E1F22]">
            <NavigationAction />
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            <ScrollArea className="flex-1 w-full">
                {guilds.map((guild) => (
                    <div key={guild.id} className="mb-4">
                        <NavigationItem
                            id={guild.id}
                            name={guild.name}
                            imageUrl={guild.imageUrl}
                        />
                    </div>
                ))}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ThemeToggle />
                <UserButton afterSignOutUrl="/" appearance={{
                    elements: {
                        avatarBox: "h-[48px] w-[48px]"
                    }
                }} />
            </div>
        </div>
    );
}