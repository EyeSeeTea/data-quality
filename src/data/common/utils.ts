import { MetadataItem } from "$/domain/entities/MetadataItem";
import { Id } from "$/domain/entities/Ref";
import { TrackedEntitiesGetResponse } from "$/types/d2-api";
import { TrackerEventsResponse } from "@eyeseetea/d2-api/api/trackerEvents";

export function getProgramStageIndexById(programStageId: Id, metadata: MetadataItem): number {
    const programStageIndex = metadata.programs.qualityIssues.programStages.findIndex(
        programStage => programStage.id === programStageId
    );
    if (programStageIndex === -1) throw Error(`Cannot found programStage: ${programStageId}`);
    return programStageIndex;
}

export function buildTrackerResponse(
    response: TrackedEntitiesGetResponse & {
        trackedEntities?: TrackedEntitiesGetResponse["instances"];
    }
): TrackedEntitiesGetResponse {
    if (!response.instances && response.trackedEntities) {
        return { ...response, instances: response.trackedEntities };
    } else if (!response.trackedEntities && response.instances) {
        return response;
    } else {
        return response;
    }
}

export function buildTrackerEventsResponse(
    response: TrackerEventsResponse & {
        events?: TrackerEventsResponse["instances"];
    }
): TrackerEventsResponse {
    if (!response.instances && response.events) {
        return { ...response, instances: response.events };
    } else if (!response.events && response.instances) {
        return response;
    } else {
        return response;
    }
}
