'use client';

import axios from "axios";
import qs from "query-string";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { GuildWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import { useModal } from "@/hooks/use-modal-store";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuTrigger,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@prisma/client";

const roleIconMap = {
	"MEMBER": null,
	"MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
	"ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
}

export const MembersModal = () => {
	const router = useRouter();
	const { onOpen, isOpen, onClose, type, data } = useModal();
	const [loadingId, setLoadingId] = useState("");

	const isModalOpen = isOpen && type === "members";
	const { guild } = data as { guild: GuildWithMembersWithProfiles };

	const onKick = async (memberId: string) => {
		try {
			setLoadingId(memberId);
			const url = qs.stringifyUrl({
				url: `/api/members/${memberId}`,
				query: {
					guildId: guild?.id
				}
			});

			const response = await axios.delete(url);

			router.refresh();
			onOpen("members", { guild: response.data });
		} catch (error: any) {
			console.log(error)
		} finally {
			setLoadingId("")
		}
	}

	const onRoleChange = async (memberId: string, role: MemberRole) => {
		try {
			setLoadingId(memberId);
			const url = qs.stringifyUrl({
				url: `/api/members/${memberId}`,
				query: {
					guildId: guild?.id,
				}
			});

			const response = await axios.patch(url, { role });

			router.refresh();
			onOpen("members", { guild: response.data });

		} catch (error: any) {
			console.log(error);
		} finally {
			setLoadingId("");
		}
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-center text-2xl font-bold">
						Manage Members
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						{guild?.members?.length} Members
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="mt-8 max-h-[420px] pr-6">
					{guild?.members?.map((member) => (
						<div key={member.id} className="flex items-center gap-x-2 mb-6">
							<UserAvatar src={member.profile.imageUrl} />
							<div className="flex flex-col gap-y-1">
								<div className="text-xs font-semibold flex items-center gap-x-1">
									{member.profile.name}
									{roleIconMap[member.role]}
								</div>
								<p className="text-xs text-zinc-500">
									{member.profile.email}
								</p>
							</div>
							{guild.profileId !== member.profile.id && loadingId !== member.id && (
								<div className="ml-auto">
									<DropdownMenu>
										<DropdownMenuTrigger>
											<MoreVertical className="h-4 w-4 text-zinc-500" />
										</DropdownMenuTrigger>
										<DropdownMenuContent side="left">
											<DropdownMenuSub>
												<DropdownMenuSubTrigger className="flex items-center">
													<ShieldQuestion className="h-4 w-4 mr-2" />
													<span>Role</span>
												</DropdownMenuSubTrigger>
												<DropdownMenuPortal>
													<DropdownMenuSubContent>
														<DropdownMenuItem onClick={() => onRoleChange(member.id, "MEMBER")}>
															<Shield className="h-4 w-4 mr-2" />
															<span className="mr-2">
																Member
															</span>
															{member.role === "MEMBER" && (
																<Check className="h-4 w-4 ml-auto" />
															)}
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => onRoleChange(member.id, "MODERATOR")}>
															<Shield className="h-4 w-4 mr-2" />
															<span className="mr-2">
																Moderator
															</span>
															{member.role === "MODERATOR" && (
																<ShieldCheck className="h-4 w-4 ml-auto" />
															)}
														</DropdownMenuItem>
													</DropdownMenuSubContent>
												</DropdownMenuPortal>
											</DropdownMenuSub>
											<DropdownMenuSeparator />
											<DropdownMenuItem onClick={() => onKick(member.id)}>
												<Gavel className="h-4 w-4 mr-2" />
												Kick
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							)}
							{loadingId === member.id && (
								<Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
							)}
						</div>
					))}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	)
}