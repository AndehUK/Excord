import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

import { Guild, Member, Profile } from "@prisma/client"

export type GuildWithMembersWithProfiles = Guild & {
    members: (Member & { profile: Profile })[];
};

export type NextAPIResposeServerIO = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        };
    };
};