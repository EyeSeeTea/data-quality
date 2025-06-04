import React from "react";
import { IconButton, TextField } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";

import i18n from "$/utils/i18n";
import styled from "styled-components";

export const InputInline: React.FC<InputInlineProps> = React.memo(props => {
    const { inputType, value, onSave } = props;
    const [showInput, setShowInput] = React.useState(false);
    const [text, setText] = React.useState(() => value);
    const inputRef = React.useRef<HTMLInputElement>();
    const refForm = React.useRef<HTMLFormElement>(null);

    const onDoubleClick = () => {
        setShowInput(true);
    };

    const onCancel = () => {
        setShowInput(false);
    };

    const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && refForm.current) {
            refForm.current.requestSubmit();
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowInput(false);
        setText(inputRef.current?.value || "");
        onSave(inputRef.current?.value || "");
    };

    return (
        <>
            {showInput ? (
                <form ref={refForm} onSubmit={onSubmit}>
                    <TextField
                        onKeyUp={onKeyUp}
                        autoFocus
                        defaultValue={text}
                        inputRef={inputRef}
                        type={inputType || "text"}
                    />
                    <div>
                        <IconButton aria-label={i18n.t("Save")} size="small" type="submit">
                            <SaveIcon />
                        </IconButton>
                        <IconButton aria-label={i18n.t("Cancel")} onClick={onCancel} size="small">
                            <CancelIcon />
                        </IconButton>
                    </div>
                </form>
            ) : (
                <CellContainer
                    style={{ height: text.length === 0 ? "70px" : undefined }}
                    onDoubleClick={onDoubleClick}
                    title={i18n.t("Double click to edit")}
                >
                    {text}
                </CellContainer>
            )}
        </>
    );
});

const CellContainer = styled.div`
    border: transparent;
    cursor: pointer;
    &:hover {
        border: 1px solid #e0e0e0;
        transition: border ease-in 0.2s;
    }
`;

type InputInlineProps = {
    inputType?: React.HTMLInputTypeAttribute;
    value: string;
    onSave: (value: string) => void;
};
