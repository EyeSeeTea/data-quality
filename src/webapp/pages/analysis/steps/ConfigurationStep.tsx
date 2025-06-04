import React from "react";
import i18n from "$/utils/i18n";
import { Typography } from "@material-ui/core";
import styled from "styled-components";

import { ConfigurationForm } from "$/webapp/components/configuration-form/ConfigurationForm";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { useAnalysisMethods } from "$/webapp/hooks/useQualityAnalysisTable";
import { UpdateAnalysisState } from "$/webapp/pages/analysis/AnalysisPage";

export type ConfigurationStepProps = {
    analysis: QualityAnalysis;
    updateAnalysis: UpdateAnalysisState;
    updateCountry: React.Dispatch<React.SetStateAction<boolean>>;
};

const noop = () => {};

export const ConfigurationStep: React.FC<ConfigurationStepProps> = React.memo(props => {
    const { analysis, updateAnalysis, updateCountry } = props;
    const { saveQualityAnalysis } = useAnalysisMethods({
        onSuccess: noop,
        onRemove: noop,
    });

    const onSave = React.useCallback(
        (analysisToUpdate: QualityAnalysis) => {
            saveQualityAnalysis(analysisToUpdate);
            updateAnalysis(analysisToUpdate);
        },
        [saveQualityAnalysis, updateAnalysis]
    );

    if (!analysis) return null;

    return (
        <Container>
            <TitleContainer>
                <StyledTypography variant="h2">{i18n.t("Configuration")}</StyledTypography>
            </TitleContainer>
            <ConfigurationForm
                updateCountry={updateCountry}
                initialData={analysis}
                onSave={onSave}
            />
        </Container>
    );
});

const Container = styled.section``;

const TitleContainer = styled.div`
    min-height: 5rem;
    display: flex;
    align-items: center;
    margin-block-end: 1.75rem;
`;

const StyledTypography = styled(Typography)`
    font-size: 1.2rem;
    font-weight: 500;
    vertical-align: center;
`;
