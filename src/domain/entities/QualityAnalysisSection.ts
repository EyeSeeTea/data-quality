import { Struct } from "./generic/Struct";
import { QualityAnalysisIssue } from "./QualityAnalysisIssue";
import { Id } from "./Ref";

export interface QualityAnalysisSectionAttrs {
    id: Id;
    name: string;
    description: string;
    issues: QualityAnalysisIssue[];
    status: string;
    position: number;
}

export const SECTION_PENDING_STATE = "pending";

export class QualityAnalysisSection extends Struct<QualityAnalysisSectionAttrs>() {
    static getInitialStatus(): string {
        return SECTION_PENDING_STATE;
    }

    static isPending(section: QualityAnalysisSection): boolean {
        return section.status === SECTION_PENDING_STATE;
    }
}
