import { Menu } from "lucide-react"

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { GuildSidebar } from "./guild/guild-sidebar";

export const MobileToggle = ({
    guildId
}: { guildId: string }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0">
                <div className="w-[72px]">
                    <NavigationSidebar />
                </div>
                <GuildSidebar guildId={guildId} />
            </SheetContent>
        </Sheet>
    )
}