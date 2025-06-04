import Typography from "@material-ui/core/Typography";
import styled, { css } from "styled-components";
import React from "react";
import customTheme from "$/webapp/pages/app/themes/customTheme";

type Props = {
    message: string;
    variant: "neutral" | "success";
};

export type ContainerProps = {
    $variant: Props["variant"];
};

export const EmptyState: React.FC<Props> = React.memo(({ message, variant }) => {
    return (
        <Container $variant={variant}>
            <Typography>{message}</Typography>
        </Container>
    );
});

const Container = styled.section<ContainerProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${customTheme.color.lightGrey};
    color: ${customTheme.color.dark};
    border-color: ${customTheme.color.dark};
    border: 1px solid;
    border-radius: 4px;
    height: 28rem;
    width: 100%;

    ${({ $variant }) =>
        $variant === "success" &&
        css`
            background-color: ${customTheme.color.lightGreen};
            color: ${customTheme.color.green};
            border-color: ${customTheme.color.green};
        `};
`;
