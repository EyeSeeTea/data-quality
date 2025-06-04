import React from "react";
import { Typography } from "@material-ui/core";
import styled from "styled-components";
import { IssueTable } from "$/webapp/components/issues/IssueTable";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";

interface PageProps {
    name: string;
    analysis: QualityAnalysis;
}

export const SummaryStep: React.FC<PageProps> = React.memo(({ name, analysis }) => {
    return (
        <Container>
            <TitleContainer>
                <StyledTypography variant="h2">{name}</StyledTypography>
            </TitleContainer>
            <IssueTable
                analysisId={analysis.id}
                sectionId={undefined}
                reload={0}
                showExport
                showStepFilter
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
