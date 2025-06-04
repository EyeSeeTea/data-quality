import React from "react";
import i18n from "$/utils/i18n";
import { Dropdown } from "@eyeseetea/d2-ui-components";
import styled from "styled-components";
import { useValidationStep } from "./useValidationStep";
import { PageStepProps } from "$/webapp/pages/analysis/AnalysisPage";
import { StepAnalysis } from "$/webapp/pages/analysis/steps/StepAnalysis";
import { UserFeedbackContainer } from "$/webapp/components/user-feedback-container/UserFeedbackContainer";

export const ValidationStep: React.FC<PageStepProps> = React.memo(props => {
    const { analysis, section, title, updateAnalysis } = props;
    const {
        validationRules,
        handleChange,
        runAnalysis,
        reload,
        selectedValidationRule,
        isLoading,
        error,
    } = useValidationStep({ analysis, section, updateAnalysis });

    return (
        <UserFeedbackContainer isLoading={isLoading} error={error}>
            <StepAnalysis
                id={analysis.id}
                section={section}
                reload={reload}
                title={title}
                onRun={() => runAnalysis()}
            >
                <StyledDropdown
                    hideEmpty
                    items={validationRules}
                    onChange={handleChange}
                    value={selectedValidationRule}
                    label={i18n.t("Validation Rule Group")}
                />
            </StepAnalysis>
        </UserFeedbackContainer>
    );
});

const StyledDropdown = styled(Dropdown)`
    min-width: 14rem;
`;
