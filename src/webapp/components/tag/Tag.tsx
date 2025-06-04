import styled, { css } from "styled-components";
import customTheme from "$/webapp/pages/app/themes/customTheme";
import { memo } from "react";

type Props = {
    status: string;
    name: string;
};

export type ContainerProps = {
    $status: Props["status"];
};

export const Tag: React.FC<Props> = memo(({ status, name }) => {
    return <Container $status={status}>{name}</Container>;
});

export const Container = styled.span<ContainerProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-block: 0.4375rem;
    padding-inline: 0.25rem;
    border-radius: 1.1875rem;
    min-height: 1.5rem;
    font-size: 0.8125rem;
    width: 100%;
    white-space: nowrap;
    text-transform: capitalize;
    color: ${customTheme.color.dark};
    background-color: ${customTheme.color.lighterGrey};

    ${({ $status }) =>
        $status === "success" &&
        css`
            color: ${customTheme.color.light};
            background-color: ${customTheme.color.intenseGreen};
        `};
`;
