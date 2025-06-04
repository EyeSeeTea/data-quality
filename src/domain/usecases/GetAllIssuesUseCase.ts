import { FutureData } from "$/data/api-futures";
import { RowsPaginated } from "$/domain/entities/Pagination";
import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { GetIssuesOptions, IssueRepository } from "$/domain/repositories/IssueRepository";

export class GetAllIssuesUseCase {
    constructor(private issueRepository: IssueRepository) {}

    execute(options: GetIssuesOptions): FutureData<RowsPaginated<QualityAnalysisIssue>> {
        return this.issueRepository.get(options);
    }
}
