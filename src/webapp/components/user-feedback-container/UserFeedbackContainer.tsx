import i18n from "$/utils/i18n";
import { useLoading, useSnackbar } from "@eyeseetea/d2-ui-components";
import React from "react";
import { ReactNode } from "react";
import { Maybe } from "$/utils/ts-utils";

export type UserFeedbackProps = {
    isLoading: boolean;
    error: Maybe<string>;
    children: ReactNode;
};

export const UserFeedbackContainer: React.FC<UserFeedbackProps> = React.memo(props => {
    const { isLoading, error, children } = props;
    const loading = useLoading();
    const snackbar = useSnackbar();

    React.useEffect(() => {
        if (isLoading) loading.show(isLoading, i18n.t("Running analysis..."));
        else loading.hide();
    }, [isLoading, loading]);

    React.useEffect(() => {
        if (error) snackbar.error(error);
    }, [error, snackbar]);
    return children;
});
