import { FutureData } from "$/data/api-futures";
import { Id } from "$/domain/entities/Ref";
import { GetIssuesOptions, IssueRepository } from "$/domain/repositories/IssueRepository";
import { Maybe } from "$/utils/ts-utils";
import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { Future } from "$/domain/entities/generic/Future";
import { QualityAnalysisRepository } from "$/domain/repositories/QualityAnalysisRepository";
import { UCAnalysis } from "./common/UCAnalysis";
import { RowsPaginated } from "$/domain/entities/Pagination";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import _ from "$/domain/entities/generic/Collection";

export class CopyContactEmailsUseCase {
    private analysisUseCase: UCAnalysis;
    constructor(
        private analysisRepository: QualityAnalysisRepository,
        private issueRepository: IssueRepository
    ) {
        this.analysisUseCase = new UCAnalysis(this.analysisRepository);
    }

    execute(options: CopyContactEmailsOptions): FutureData<void> {
        return this.analysisUseCase.getById(options.analysisId).flatMap(analysis => {
            return this.getAllIssues(options, { initialPage: 1, issues: [] }).flatMap(issues => {
                const selectedIssue = issues.find(issue => issue.id === options.issueId);
                if (!selectedIssue)
                    return Future.error(new Error(`Issue not found: ${options.issueId}`));

                const newIssues = this.copyContactEmailsToOtherIssues(issues, selectedIssue);
                const analysisWithIssues = this.addIssuesToAnalysis(analysis, newIssues);
                return this.analysisRepository.save([analysisWithIssues]);
            });
        });
    }

    private addIssuesToAnalysis(
        analysis: QualityAnalysis,
        newIssues: QualityAnalysisIssue[]
    ): QualityAnalysis {
        return QualityAnalysis.build({
            ...analysis,
            sections: analysis.sections.map(section => {
                const issuesBySection = newIssues.filter(issue => issue.type === section.id);
                return QualityAnalysisSection.create({
                    ...section,
                    issues: issuesBySection,
                });
            }),
        }).get();
    }

    private copyContactEmailsToOtherIssues(
        issues: QualityAnalysisIssue[],
        selectedIssue: QualityAnalysisIssue
    ): QualityAnalysisIssue[] {
        return issues.map((issue): QualityAnalysisIssue => {
            if (issue.id === selectedIssue.id) return issue;
            return QualityAnalysisIssue.create({
                ...issue,
                contactEmails: selectedIssue.contactEmails,
            });
        });
    }

    private getAllIssues(
        options: CopyContactEmailsOptions,
        state: { initialPage: number; issues: QualityAnalysisIssue[] }
    ): FutureData<QualityAnalysisIssue[]> {
        const { initialPage, issues } = state;
        return this.getIssues(options, initialPage).flatMap(response => {
            const newIssues = [...issues, ...response.rows];
            if (response.pagination.page >= response.pagination.pageCount) {
                return Future.success(newIssues);
            } else {
                return this.getAllIssues(options, {
                    initialPage: initialPage + 1,
                    issues: newIssues,
                });
            }
        });
    }

    private getIssues(
        options: CopyContactEmailsOptions,
        page: number
    ): FutureData<RowsPaginated<QualityAnalysisIssue>> {
        return this.issueRepository.get({
            filters: {
                ...options.filters,
                analysisIds: [options.analysisId],
                sectionId: options.sectionId,
            },
            pagination: { page: page, pageSize: 100 },
            sorting: { field: "number", order: "asc" },
        });
    }
}

type CopyContactEmailsOptions = {
    analysisId: Id;
    sectionId: Maybe<Id>;
    issueId: Id;
    filters: GetIssuesOptions["filters"];
};
