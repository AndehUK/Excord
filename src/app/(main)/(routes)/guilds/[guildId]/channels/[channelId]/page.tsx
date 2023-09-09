import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";

interface ChannelIDPageProps {
    params: {
        guildId: string;
        channelId: string;
    },
};

const ChannelIDPage = async ({
    params
}: ChannelIDPageProps) => {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId,
        }
    });

    const member = await db.member.findFirst({
        where: {
            guildId: params.guildId,
            profileId: profile.id,
        }
    });

    if (!channel || !member) {
        redirect("/")
    }

    return (
        <div className="bg-white flex flex-col h-full dark:bg-[#313338]">
            <ChatHeader
                name={channel.name}
                guildId={channel.guildId}
                type="channel"
            />
            <ChatMessages
                member={member}
                name={channel.name}
                chatId={channel.id}
                type="channel"
                apiUrl="/api/messages"
                socketUrl="/api/socket/messages"
                socketQuery={{
                    channelId: channel.id,
                    guildId: channel.guildId,
                }}
                paramKey="channelId"
                paramValue={channel.id}
            />
            <ChatInput
                name={channel.name}
                type="channel"
                apiUrl="/api/socket/messages"
                query={{
                    channelId: channel.id,
                    guildId: channel.guildId,
                }}
            />
        </div>
    )
}

export default ChannelIDPage;