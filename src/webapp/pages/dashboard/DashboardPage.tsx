import React from "react";
import { ObjectsTable, useObjectsTable } from "@eyeseetea/d2-ui-components";

import i18n from "$/utils/i18n";
import { PageHeader } from "$/webapp/components/page-header/PageHeader";
import { ConfirmationDialog } from "@eyeseetea/d2-ui-components";
import {
    AnalysisFilterState,
    AnalysisFilters,
    initialFilters,
} from "$/webapp/components/analysis-filter/AnalysisFilter";
import {
    useAnalysisMethods,
    useGetRows,
    useTableConfig,
} from "$/webapp/hooks/useQualityAnalysisTable";
import { useModules } from "$/webapp/hooks/useModule";
import { Module } from "$/domain/entities/Module";
import { Id } from "$/domain/entities/Ref";
import { ActionType } from "$/webapp/components/analysis-actions/AnalysisActions";
import { useHistory } from "react-router-dom";
import { PageContainer } from "$/webapp/components/page-container/PageContainer";

type Props = { name: string };

export const DashboardPage: React.FC<Props> = React.memo(props => {
    const { name } = props;
    const [reload, refreshReload] = React.useState(0);
    const [selectedIds, setSelectedIds] = React.useState<{ action: ActionType; ids: Id[] }>();
    const [filters, setFilters] = React.useState<AnalysisFilterState>(initialFilters);
    const history = useHistory();
    const { createQualityAnalysis, removeQualityAnalysis, updateStatusQualityAnalysis } =
        useAnalysisMethods({
            onSuccess: id => {
                history.push(`/analysis/${id}`);
            },
            onRemove: () => {
                setSelectedIds(undefined);
                refreshReload(reload + 1);
            },
        });
    const { tableConfig } = useTableConfig({
        onRemoveQualityAnalysis: React.useCallback(
            (ids, action) => {
                if (action === "open" && ids[0]) {
                    history.push(`/analysis/${ids[0]}`);
                } else {
                    setSelectedIds({ action, ids });
                }
            },
            [history]
        ),
    });
    const { getRows, loading } = useGetRows(filters, reload);
    const modules = useModules();
    const config = useObjectsTable(tableConfig, getRows);

    const onCreateAnalysis = React.useCallback(
        (selectedModule: Module) => {
            createQualityAnalysis(selectedModule, "");
        },
        [createQualityAnalysis]
    );

    const onRemoveAnalysis = React.useCallback(() => {
        if (!selectedIds) return false;
        if (selectedIds.action === "delete") {
            removeQualityAnalysis(selectedIds.ids);
        } else if (selectedIds.action === "inprogress" || selectedIds.action === "completed") {
            updateStatusQualityAnalysis(selectedIds.ids, selectedIds.action);
        }
    }, [removeQualityAnalysis, selectedIds, updateStatusQualityAnalysis]);

    const filterComponents = React.useMemo(() => {
        return (
            <AnalysisFilters
                modules={modules}
                initialFilters={filters}
                onChange={setFilters}
                onCreateAnalysis={onCreateAnalysis}
            />
        );
    }, [filters, modules, onCreateAnalysis]);

    return (
        <PageContainer>
            <PageHeader title={i18n.t(name)} />
            <ObjectsTable loading={loading} {...config} filterComponents={filterComponents} />
            <ConfirmationDialog
                isOpen={selectedIds && selectedIds.ids.length > 0}
                title={i18n.t("Are you sure you want to {{action}} the selected rows?", {
                    action: selectedIds?.action === "delete" ? "remove" : "update",
                })}
                onSave={onRemoveAnalysis}
                onCancel={() => setSelectedIds(undefined)}
                saveText={i18n.t("Yes, {{actionButton}}", {
                    actionButton: selectedIds?.action === "delete" ? "Delete" : "Update",
                })}
                cancelText={i18n.t("Cancel")}
                fullWidth={true}
                disableEnforceFocus
            />
        </PageContainer>
    );
});
