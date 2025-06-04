import React from "react";
import { OrgUnitsSelector } from "@eyeseetea/d2-ui-components";

import { D2Api } from "$/types/d2-api";
import { Id } from "$/domain/entities/Ref";
import _ from "$/domain/entities/generic/Collection";

export const CountrySelector: React.FC<CountrySelectorProps> = props => {
    const { api, onChange, rootIds, selectedCountriesIds: selectedOrgUnits } = props;

    const onOrgUnitsChange = (ids: Id[]) => {
        onChange(ids);
    };

    return (
        <OrgUnitsSelector
            api={api}
            onChange={onOrgUnitsChange}
            selected={selectedOrgUnits}
            levels={[1, 2, 3]}
            selectableLevels={[1, 2, 3]}
            rootIds={rootIds}
            withElevation={false}
        />
    );
};

type CountrySelectorProps = {
    api: D2Api;
    onChange: (ids: Id[]) => void;
    rootIds: Id[];
    selectedCountriesIds: Id[];
};
