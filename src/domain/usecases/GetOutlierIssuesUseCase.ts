import { FutureData } from "$/data/api-futures";
import { RowsPaginated } from "../entities/Pagination";
import { QualityAnalysisIssue } from "../entities/QualityAnalysisIssue";
import { GetIssuesOptions, IssueRepository } from "$/domain/repositories/IssueRepository";

export class GetOutlierIssuesUseCase {
    constructor(private issueRepository: IssueRepository) {}

    execute(options: GetIssuesOptions): FutureData<RowsPaginated<QualityAnalysisIssue>> {
        return this.issueRepository.get(options);
    }
}
