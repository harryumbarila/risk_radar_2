import { handleAuth } from "@auth0/nextjs-auth0";
import { auth0Config } from "../../../../../auth0-config";

// @ts-ignore
export const GET = handleAuth(auth0Config);
