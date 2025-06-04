import React from "react";
import { Dropdown } from "@eyeseetea/d2-ui-components";
import i18n from "$/utils/i18n";
import { algorithmList, thresholdList, useAnalysisOutlier } from "./useOutliers";
import { StepAnalysis } from "$/webapp/pages/analysis/steps/StepAnalysis";
import { PageStepProps } from "$/webapp/pages/analysis/AnalysisPage";
import { UserFeedbackContainer } from "$/webapp/components/user-feedback-container/UserFeedbackContainer";

export const OutliersStep: React.FC<PageStepProps> = React.memo(props => {
    const { title, analysis, section, updateAnalysis, updateQualityFilters, qualityFilters } =
        props;

    const [reload, refreshReload] = React.useState(0);
    const { runAnalysisOutlier, isLoading, error } = useAnalysisOutlier({
        onSucess: qualityAnalysis => {
            refreshReload(reload + 1);
            updateAnalysis(qualityAnalysis);
        },
    });

    const runAnalysis = () => {
        runAnalysisOutlier({
            algorithm: qualityFilters.algorithm,
            analysisId: analysis.id,
            sectionId: section.id,
            threshold: qualityFilters.threshold,
        });
    };

    if (!analysis) return null;

    return (
        <UserFeedbackContainer isLoading={isLoading} error={error}>
            <StepAnalysis
                id={analysis.id}
                onRun={runAnalysis}
                reload={reload}
                section={section}
                title={title}
                allowRerun={section.status === "success"}
            >
                <Dropdown
                    hideEmpty
                    items={algorithmList}
                    onChange={value => updateQualityFilters(value, "algorithm")}
                    value={qualityFilters.algorithm}
                    label={i18n.t("Algorithm")}
                />
                <Dropdown
                    hideEmpty
                    items={thresholdList}
                    onChange={value => updateQualityFilters(value, "threshold")}
                    value={qualityFilters.threshold}
                    label={i18n.t("Threshold")}
                />
            </StepAnalysis>
        </UserFeedbackContainer>
    );
});
