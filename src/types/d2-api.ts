import { D2Api } from "@eyeseetea/d2-api/2.36";
import { getMockApiFromClass } from "@eyeseetea/d2-api";

export { CancelableResponse } from "@eyeseetea/d2-api";
export { D2Api } from "@eyeseetea/d2-api/2.36";
export type { MetadataPick, D2TrackedEntityInstance } from "@eyeseetea/d2-api/2.36";
export const getMockApi = getMockApiFromClass(D2Api);
export type {
    D2TrackerTrackedEntity,
    TrackedEntitiesGetResponse,
} from "@eyeseetea/d2-api/api/trackerTrackedEntities";
export type { D2TrackerEnrollment } from "@eyeseetea/d2-api/api/trackerEnrollments";
export type { D2TrackerEvent, DataValue } from "@eyeseetea/d2-api/api/trackerEvents";
