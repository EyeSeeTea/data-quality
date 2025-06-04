import React from "react";
import _ from "$/domain/entities/generic/Collection";
import { ReferenceObject, TableColumn } from "@eyeseetea/d2-ui-components";

export type UseTableUtilsProps<T extends ReferenceObject> = {
    storageId: string;
    columns: TableColumn<T>[];
};

function getFullStorageName(storageId: string): string {
    if (!storageId) throw Error("Storage id cannot be empty");
    return `dq_${storageId}_columns`;
}

export function useTableUtils<T extends ReferenceObject>(props: UseTableUtilsProps<T>) {
    const saveColumns = React.useCallback(
        (columns: (keyof T)[]) => {
            if (columns.length === 0) return;
            window.localStorage.setItem(
                getFullStorageName(props.storageId),
                JSON.stringify(columns)
            );
        },
        [props.storageId]
    );

    const columnsToShow = React.useMemo(() => {
        const columnsStorage = window.localStorage.getItem(getFullStorageName(props.storageId));
        if (columnsStorage) {
            const columnsInStorage = JSON.parse(columnsStorage) as string[];
            return _(props.columns)
                .map(column => {
                    const columnInfo = columnsInStorage.find(
                        columnName => columnName === column.name
                    );
                    return { ...column, hidden: columnInfo ? false : true };
                })
                .compact()
                .value();
        }
        return props.columns;
    }, [props.columns, props.storageId]);

    return { columnsToShow, saveColumns };
}
