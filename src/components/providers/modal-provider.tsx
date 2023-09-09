"use client";

import { useEffect, useState } from "react";

import { CreateGuildModal } from "@/components/modals/create-guild-modal";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { DeleteChannelModal } from "@/components/modals/delete-channel-modal";
import { DeleteGuildModal } from "@/components/modals/delete-guild-modal";
import { DeleteMessageModal } from "@/components/modals/delete-message-modal";
import { EditChannelModal } from "@/components/modals/edit-channel-modal";
import { EditGuildModal } from "@/components/modals/edit-guild-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { MessageFileModal } from "@/components/modals/message-file-modal";
import { LeaveGuildModal } from "@/components/modals/leave-guild-modal";
import { MembersModal } from "@/components/modals/members-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <CreateChannelModal />
            <CreateGuildModal />
            <DeleteChannelModal />
            <DeleteGuildModal />
            <DeleteMessageModal />
            <EditChannelModal />
            <EditGuildModal />
            <InviteModal />
            <MessageFileModal />
            <MembersModal />
            <LeaveGuildModal />
        </>
    )
}