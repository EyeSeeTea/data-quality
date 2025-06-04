import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { Struct } from "$/domain/entities/generic/Struct";
import _ from "$/domain/entities/generic/Collection";

export type DismissedAnalysisAttrs = {
    existingIssues: QualityAnalysisIssue[];
    newIssues: QualityAnalysisIssue[];
};

export class DismissedAnalysis extends Struct<DismissedAnalysisAttrs>() {
    mergeDuplicates(): QualityAnalysisIssue[] {
        const dismissedIssues = this.existingIssues.filter(issue => issue.status?.code === "4");
        const issues = _(this.newIssues)
            .map(issue => {
                const existingIssue = dismissedIssues.find(
                    d =>
                        d.period === issue.period &&
                        d.dataElement?.id === issue.dataElement?.id &&
                        d.country?.id === issue.country?.id &&
                        d.categoryOption?.id === issue.categoryOption?.id &&
                        d.description === issue.description
                );
                if (!existingIssue) return issue;
                return QualityAnalysisIssue.create({
                    ...issue,
                    status: existingIssue.status,
                    followUp: existingIssue.followUp,
                    action: existingIssue.action,
                    contactEmails: existingIssue.contactEmails,
                    actionDescription: existingIssue.actionDescription,
                    comments: existingIssue.comments,
                    azureUrl: existingIssue.azureUrl,
                });
            })
            .compact()
            .value();
        return issues;
    }
}
