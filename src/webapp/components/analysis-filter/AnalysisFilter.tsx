import React from "react";
import { Dropdown } from "@eyeseetea/d2-ui-components";

import i18n from "$/utils/i18n";
import _, { Collection } from "$/domain/entities/generic/Collection";
import { Module } from "$/domain/entities/Module";
import { qualityAnalysisStatus } from "$/domain/entities/QualityAnalysisStatus";
import { Maybe } from "$/utils/ts-utils";
import { MenuButton } from "$/webapp/components/menu-button/MenuButton";
import { Id } from "$/domain/entities/Ref";

const currentYear = new Date().getFullYear();

export const periods = Collection.range(2000, currentYear + 1)
    .map(period => {
        return { value: period.toString(), text: period.toString() };
    })
    .reverse()
    .value();

type AnalysisFiltersProps = {
    modules: Module[];
    initialFilters: AnalysisFilterState;
    onChange: React.Dispatch<React.SetStateAction<AnalysisFilterState>>;
    onCreateAnalysis: (module: Module) => void;
};

export const AnalysisFilters: React.FC<AnalysisFiltersProps> = props => {
    const { modules, initialFilters, onChange, onCreateAnalysis } = props;

    const modulesFilters = modules.map(module => {
        return { value: module.id, text: module.name };
    });

    const analysisStatus = qualityAnalysisStatus.map(status => {
        return { value: status, text: status };
    });

    const onFilterChange = React.useCallback<
        (value: Maybe<string>, filterAttribute: string) => void
    >(
        (value, filterAttribute) => {
            onChange(prev => ({ ...prev, [filterAttribute]: value }));
        },
        [onChange]
    );

    const onModuleSelected = (moduleId: Id) => {
        const selectedModule = modules.find(module => module.id === moduleId);
        if (!selectedModule) return false;
        onCreateAnalysis(selectedModule);
    };

    return (
        <>
            <Dropdown
                items={modulesFilters}
                onChange={value => onFilterChange(value, "module")}
                value={initialFilters.module}
                label={i18n.t("Dataset")}
            />
            <Dropdown
                items={periods}
                onChange={value => onFilterChange(value, "startDate")}
                value={initialFilters.startDate}
                label={i18n.t("Start Date")}
            />
            <Dropdown
                items={periods}
                onChange={value => onFilterChange(value, "endDate")}
                value={initialFilters.endDate}
                label={i18n.t("End Date")}
            />
            <Dropdown
                items={analysisStatus}
                onChange={value => onFilterChange(value, "status")}
                value={initialFilters.status}
                label={i18n.t("Status")}
            />

            <MenuButton
                label={i18n.t("New Data Quality Report")}
                items={modules.map(module => ({ id: module.id, label: module.name }))}
                onItemSelected={onModuleSelected}
            />
        </>
    );
};

export type AnalysisFilterState = {
    endDate: Maybe<string>;
    module: Maybe<string>;
    name: Maybe<string>;
    startDate: Maybe<string>;
    status: Maybe<string>;
};

export const initialFilters: AnalysisFilterState = {
    endDate: undefined,
    module: undefined,
    name: undefined,
    startDate: undefined,
    status: undefined,
};
