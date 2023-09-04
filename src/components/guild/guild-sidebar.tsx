import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { GuildChannel } from "@/components/guild/guild-channel";
import { GuildHeader } from "@/components/guild/guild-header";
import { GuildMember } from "@/components/guild/guild-member";
import { GuildSection } from "@/components/guild/guild-section";
import { GuildSearch } from "@/components/guild/guild-search";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface GuildSidebarProps {
    guildId: string
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
    [MemberRole.MEMBER]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
}

export const GuildSidebar = async ({ guildId }: GuildSidebarProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirect("/");
    }

    const guild = await db.guild.findUnique({
        where: {
            id: guildId, members: {
                some: { profileId: profile.id }
            }
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                },
            },
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

    const textChannels = guild?.channels.filter((channel) => channel.type === ChannelType.TEXT);
    const audioChannels = guild?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
    const videoChannels = guild?.channels.filter((channel) => channel.type === ChannelType.VIDEO);

    const members = guild?.members.filter((member) => member.profileId !== profile.id);

    if (!guild) {
        return redirect("/")
    }

    const role = guild.members.find((member) => member.profileId === profile.id)?.role;

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <GuildHeader guild={guild} role={role} />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <GuildSearch
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: audioChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members?.map((member) => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role],
                                }))
                            },
                        ]}
                    />
                    <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                    {!!textChannels?.length && (
                        <div className="mb-2">
                            <GuildSection
                                sectionType="channels"
                                channelType="TEXT"
                                role={role}
                                label="Text Channels"
                            />
                            <div className="space-y-[2px]">
                                {textChannels.map((channel) => (
                                    <GuildChannel
                                        key={channel.id}
                                        channel={channel}
                                        guild={guild}
                                        role={role}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {!!audioChannels?.length && (
                        <div className="mb-2">
                            <GuildSection
                                sectionType="channels"
                                channelType="AUDIO"
                                role={role}
                                label="Voice Channels"
                            />
                            <div className="space-y-[2px]">
                                {audioChannels.map((channel) => (
                                    <GuildChannel
                                        key={channel.id}
                                        channel={channel}
                                        guild={guild}
                                        role={role}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {!!videoChannels?.length && (
                        <div className="mb-2">
                            <GuildSection
                                sectionType="channels"
                                channelType="VIDEO"
                                role={role}
                                label="Video Channels"
                            />
                            <div className="space-y-[2px]">
                                {videoChannels.map((channel) => (
                                    <GuildChannel
                                        key={channel.id}
                                        channel={channel}
                                        guild={guild}
                                        role={role}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {!!members?.length && (
                        <div className="mb-2">
                            <GuildSection
                                sectionType="members"
                                role={role}
                                label="Members"
                                guild={guild}
                            />
                            {members.map((member) => (
                                <GuildMember key={member.id} member={member} guild={guild} />
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}