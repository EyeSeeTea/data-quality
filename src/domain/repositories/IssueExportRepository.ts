import { FutureData } from "$/data/api-futures";
import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";

export interface IssueExportRepository {
    export(issues: QualityAnalysisIssue[]): FutureData<void>;
}
