import styled, { css } from "styled-components";
import customTheme from "$/webapp/pages/app/themes/customTheme";
import { memo } from "react";

type Props = {
    status: string;
    text: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export type ButtonProps = {
    $status: Props["status"];
};

export const ButtonTag: React.FC<Props> = memo(({ text, onClick, status }) => {
    return (
        <Button $status={status} onClick={onClick} aria-controls="simple-menu" aria-haspopup="true">
            {text}
        </Button>
    );
});

export const Button = styled.button<ButtonProps>`
    all: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-block: 7px;
    padding-inline: 10px;
    border-radius: 19px;
    min-height: 24px;
    font-size: 0.8125rem;
    width: fit-content;
    white-space: nowrap;
    text-transform: capitalize;
    color: ${customTheme.color.dark};
    background-color: ${customTheme.color.lighterGrey};

    ${({ $status }) =>
        $status === "inactive" &&
        css`
            color: ${customTheme.color.light};
            background-color: ${customTheme.color.grey};
        `};

    ${({ $status }) =>
        $status === "done" &&
        css`
            color: ${customTheme.color.light};
            background-color: ${customTheme.color.intenseGreen};
        `};

    ${({ $status }) =>
        $status === "warning" &&
        css`
            color: ${customTheme.color.warning};
            background-color: ${customTheme.color.lightWarning};
        `};

    ${({ $status }) =>
        $status === "success" &&
        css`
            color: ${customTheme.color.green};
            background-color: ${customTheme.color.lighterGreen};
        `};
`;
