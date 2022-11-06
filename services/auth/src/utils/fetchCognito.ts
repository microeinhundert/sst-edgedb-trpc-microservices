import { TRPCError } from "@trpc/server";
import type { RequestInfo, RequestInit } from "undici";
import { fetch } from "undici";

export async function fetchCognito(input: RequestInfo, init?: RequestInit) {
  try {
    const response = await fetch(input, init);

    if (response.status !== 200) {
      throw new Error("Unexpected response returned by Cognito", {
        cause: new Error(response.statusText),
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (await response.json()) as any;
  } catch (error) {
    if (error instanceof Error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
        cause: error,
      });
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unknown error occurred in the auth service",
    });
  }
}
