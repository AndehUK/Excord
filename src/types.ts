import { Guild, Member, Profile } from "@prisma/client"

export type GuildWithMembersWithProfiles = Guild & {
    members: (Member & { profile: Profile })[];
}