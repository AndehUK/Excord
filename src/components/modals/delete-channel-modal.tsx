'use client';

import qs from "query-string";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useState } from "react";

export const DeleteChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "deleteChannel";
    const { guild, channel } = data;

    const [isLoading, setIsLoading] = useState(false);

    const onConfirm = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    guildId: guild?.id
                }
            })

            await axios.delete(url);
            onClose();
            router.refresh();
            router.push(`/guilds/${guild?.id}`);
        } catch (error: any) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-center text-2xl font-bold">
                        Delete Channel
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-indigo-500">
                            #{channel?.name}
                        </span>?
                        <br />
                        <span className="text-rose-500 font-semibold">This action is irreversable.</span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            onClick={onConfirm}
                            variant="destructive"
                        >
                            Delete
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}