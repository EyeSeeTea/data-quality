import React from "react";
import { QualityAnalysisIssue } from "$/domain/entities/QualityAnalysisIssue";
import { TableColumn } from "@eyeseetea/d2-ui-components";

import i18n from "$/utils/i18n";
import { EditIssueValue } from "./EditIssueValue";

export function useIssueColumns() {
    const [refresh, setRefresh] = React.useState(0);

    const issueColumns = React.useMemo(() => {
        const issueColumns: TableColumn<QualityAnalysisIssue>[] = [
            { name: "number", text: i18n.t("Issue"), sortable: true },
            { name: "country", text: i18n.t("Country"), sortable: false },
            { name: "period", text: i18n.t("Period"), sortable: false },
            { name: "dataElement", text: i18n.t("Data Element"), sortable: false },
            {
                name: "categoryOption",
                text: i18n.t("Category"),
                sortable: false,
            },
            {
                name: "description",
                text: i18n.t("Description"),
                sortable: false,
            },
            {
                name: "status",
                text: i18n.t("Status"),
                sortable: false,
                getValue: value => {
                    return <EditIssueValue key={value.id} field="status" issue={value} />;
                },
            },
            {
                name: "azureUrl",
                text: i18n.t("Azure URL"),
                sortable: false,
                hidden: true,
                getValue: value => {
                    return (
                        <EditIssueValue
                            key={value.id}
                            field="azureUrl"
                            issue={value}
                            setRefresh={setRefresh}
                        />
                    );
                },
            },
            {
                name: "followUp",
                text: i18n.t("Follow Up"),
                sortable: false,
                getValue: value => (
                    <EditIssueValue
                        key={value.id}
                        field="followUp"
                        issue={value}
                        setRefresh={setRefresh}
                    />
                ),
            },
            {
                name: "action",
                text: i18n.t("Action"),
                sortable: false,
                getValue: value => {
                    return <EditIssueValue key={value.id} field="action" issue={value} />;
                },
            },
            {
                name: "contactEmails",
                text: i18n.t("Contact Emails"),
                sortable: false,
                getValue: value => {
                    return <EditIssueValue key={value.id} field="contactEmails" issue={value} />;
                },
            },
            {
                name: "actionDescription",
                text: i18n.t("Action Description"),
                sortable: false,
                hidden: true,
                getValue: value => {
                    return (
                        <EditIssueValue key={value.id} field="actionDescription" issue={value} />
                    );
                },
            },
            {
                name: "comments",
                text: i18n.t("Comments"),
                sortable: false,
                hidden: true,
                getValue: value => {
                    return <EditIssueValue key={value.id} field="comments" issue={value} />;
                },
            },
        ];
        return issueColumns;
    }, [setRefresh]);

    return { refresh, setRefresh, issueColumns };
}
