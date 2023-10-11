import { z } from "zod";

export enum ContainerType {
  ERROR,
  REQUEST,
  RESPONSE,
}

export enum Notation {
  NEGATIVE,
  NEUTRAL,  
  POSITIVE,
}

export function getRequestContainerSchema() {
  return z.object({
    id        : z.string().uuid(),
    type      : z.nativeEnum(ContainerType),
    method    : z.string(),
    notation  : z.optional(z.nativeEnum(Notation)),
    data      : z.any(),
  });
}

export type Container = z.infer<ReturnType<typeof getRequestContainerSchema>>;