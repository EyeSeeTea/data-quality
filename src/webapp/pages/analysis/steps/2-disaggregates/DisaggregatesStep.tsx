import React from "react";
import i18n from "$/utils/i18n";
import styled from "styled-components";
import { useDisaggregatesStep } from "./useDisaggregatesStep";
import { SelectMultiCheckboxes } from "$/webapp/components/selectmulti-checkboxes/SelectMultiCheckboxes";
import { StepAnalysis } from "$/webapp/pages/analysis/steps/StepAnalysis";
import { PageStepProps } from "$/webapp/pages/analysis/AnalysisPage";
import { UserFeedbackContainer } from "$/webapp/components/user-feedback-container/UserFeedbackContainer";

export const DisaggregatesStep: React.FC<PageStepProps> = React.memo(props => {
    const { analysis, section, title, updateAnalysis } = props;
    const {
        disaggregations,
        handleChange,
        reload,
        runAnalysis,
        selectedDisagregations,
        isLoading,
        error,
    } = useDisaggregatesStep({
        analysis: analysis,
        updateAnalysis,
        sectionId: section.id,
    });

    const onClick = () => {
        runAnalysis();
    };

    return (
        <UserFeedbackContainer isLoading={isLoading} error={error}>
            <StepAnalysis
                id={analysis.id}
                onRun={onClick}
                reload={reload}
                section={section}
                title={title}
            >
                <FiltersContainer>
                    <SelectMultiCheckboxes
                        options={disaggregations}
                        onChange={handleChange}
                        value={selectedDisagregations}
                        label={i18n.t("CatCombos")}
                    />
                </FiltersContainer>
            </StepAnalysis>
        </UserFeedbackContainer>
    );
});

const FiltersContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;
