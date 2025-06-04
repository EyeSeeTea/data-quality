import React from "react";
import { TableAction } from "@eyeseetea/d2-ui-components";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";

import i18n from "$/utils/i18n";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { Id } from "$/domain/entities/Ref";

export function useAnalysisTableActions(props: UseAnalysisActionsProps) {
    const { onDelete } = props;

    const actions = React.useMemo((): TableAction<QualityAnalysis>[] => {
        return [
            {
                multiple: false,
                name: "Analysis",
                icon: <PlayCircleOutlineIcon />,
                text: i18n.t("Open analysis"),
                onClick: ids => onDelete(ids, "open"),
            },
            {
                multiple: true,
                name: "Complete",
                isActive: rows => rows.some(row => row.status === "In Progress"),
                icon: <AssignmentTurnedInOutlinedIcon />,
                text: i18n.t("Mark as Complete"),
                onClick: ids => {
                    onDelete(ids, "inprogress");
                },
            },
            {
                multiple: true,
                name: "In Progress",
                isActive: rows => rows.some(row => row.status === "Completed"),
                icon: <AssignmentOutlinedIcon />,
                text: i18n.t("Mark as In Progress"),
                onClick: ids => {
                    onDelete(ids, "completed");
                },
            },
            {
                multiple: true,
                name: "Delete",
                icon: <DeleteOutlinedIcon />,
                text: i18n.t("Delete"),
                onClick: ids => {
                    onDelete(ids, "delete");
                },
            },
        ];
    }, [onDelete]);

    return { actions: actions };
}

export type ActionType = "delete" | "inprogress" | "completed" | "open";

type UseAnalysisActionsProps = {
    onDelete: (ids: Id[], action: ActionType) => void;
};
