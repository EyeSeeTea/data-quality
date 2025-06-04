import { RowsPaginated } from "$/domain/entities/Pagination";
import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { IssueRepository } from "$/domain/repositories/IssueRepository";
import { FutureData } from "$/data/api-futures";

export class IssueTestRepository implements IssueRepository {
    getById(): FutureData<QualityAnalysisIssue> {
        throw new Error("Method not implemented.");
    }
    get(): FutureData<RowsPaginated<QualityAnalysisIssue>> {
        throw new Error("Method not implemented.");
    }
    create(): FutureData<void> {
        throw new Error("Method not implemented.");
    }
}
