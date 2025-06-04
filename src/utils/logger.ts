import { TrackerProgramLogger, initLogger } from "@eyeseetea/d2-logger";
import { Id } from "$/domain/entities/Ref";

export let logger: TrackerProgramLogger;

export async function setupLogger(
    baseUrl: string,
    trackerProgramId: Id,
    options?: { isDebug?: boolean }
): Promise<void> {
    const { isDebug = false } = options ?? {};
    logger = await initLogger({
        type: "trackerProgram",
        debug: isDebug,
        baseUrl: baseUrl,
        auth: undefined,
        trackerProgramId: trackerProgramId,
        messageTypeId: undefined,
    });

    if (!logger) throw Error(`Failed to initialise the logger.`);
}
