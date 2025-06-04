import React from "react";
import { Checkbox } from "@material-ui/core";

export const CheckboxInline: React.FC<CheckboxInlineProps> = React.memo(props => {
    const { onChange, value } = props;
    return (
        <Checkbox
            defaultChecked={value}
            onChange={event => onChange(event.currentTarget.checked)}
        />
    );
});

type CheckboxInlineProps = { value: boolean; onChange: (value: boolean) => void };
