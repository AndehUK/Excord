"use client";

import { useEffect, useState } from "react";

import { CreateGuildModal } from "@/components/modals/create-guild-modal";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { DeleteGuildModal } from "../modals/delete-guild-modal";
import { EditGuildModal } from "@/components/modals/edit-guild-modal";
import { InviteModal } from "@/components/modals/invite-modal";
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
            <DeleteGuildModal />
            <EditGuildModal />
            <InviteModal />
            <MembersModal />
            <LeaveGuildModal />
        </>
    )
}