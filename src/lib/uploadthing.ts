import { generateComponents } from "@uploadthing/react";

import type { fileRouter } from "@/app/api/uploadthing/core";

export const { UploadButton, UploadDropzone, Uploader } =
    generateComponents<fileRouter>();