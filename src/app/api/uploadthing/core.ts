import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const fileManager = createUploadthing();

const handleAuth = () => {
    const userId = auth();
    if (!userId) throw new Error("Unauthorised");
    return { userId: userId }
}

export const fileRouter = {
    guildImage: fileManager({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
    messageFile: fileManager(["image", "pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => { })
} satisfies FileRouter;

export type fileRouter = typeof fileRouter;