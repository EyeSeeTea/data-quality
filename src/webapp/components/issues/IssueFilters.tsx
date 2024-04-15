import React from "react";

import { Id, Period } from "$/domain/entities/Ref";
import { GetIssuesOptions } from "$/domain/repositories/IssueRepository";
import { SelectMultiCheckboxes } from "../selectmulti-checkboxes/SelectMultiCheckboxes";
import { periods } from "../analysis-filter/AnalysisFilter";
import { Maybe } from "$/utils/ts-utils";
import i18n from "$/utils/i18n";
import { useAppContext } from "$/webapp/contexts/app-context";
import { Dropdown, useSnackbar } from "@eyeseetea/d2-ui-components";
import styled from "styled-components";
import { Button, Dialog, DialogActions, TextField } from "@material-ui/core";
import { CountrySelector } from "../country-selector/CountrySelector";
import { getIdFromCountriesPaths } from "../configuration-form/ConfigurationForm";
import { Country } from "$/domain/entities/Country";

const followUpItems = [
    {
        value: "1",
        text: i18n.t("Yes"),
    },
    {
        value: "0",
        text: i18n.t("No"),
    },
];

function extractCountriesNames(countries: Country[], totalCountriesSelected: number) {
    const countryNames = countries
        .map(country => country.name)
        .slice(0, 2)
        .join(", ");

    const moreCountriesCount = totalCountriesSelected - 2;

    const countryNamesString =
        moreCountriesCount > 0
            ? i18n.t("{{countryNames}} and {{moreCountriesCount}} more", {
                  countryNames,
                  moreCountriesCount,
              })
            : countryNames;

    return countryNamesString;
}

export const IssueFilters: React.FC<IssueFiltersProps> = props => {
    const { api, compositionRoot, currentUser, metadata } = useAppContext();

    const snackbar = useSnackbar();
    const { initialFilters, onChange, showStepFilter } = props;
    const [openCountry, setOpenCountry] = React.useState(false);
    const [selectedCountriesIds, setSelectedCountriesIds] = React.useState<Id[]>([]);
    const [countries, setCountries] = React.useState<Country[]>([]);

    const onFilterChange = React.useCallback<
        (value: Maybe<string> | string[], filterAttribute: string) => void
    >(
        (value, filterAttribute) => {
            onChange(prev => ({ ...prev, [filterAttribute]: value }));
        },
        [onChange]
    );

    const actions = metadata.optionSets.nhwaAction.options.map(option => {
        return { value: option.code, text: option.name };
    });

    const status = metadata.optionSets.nhwaStatus.options.map(option => {
        return { value: option.code, text: option.name };
    });

    const step = metadata.programs.qualityIssues.programStages.map((option, index) => {
        return { value: String(index + 1), text: option.name };
    });

    const onClickCountry = () => {
        setOpenCountry(true);
    };

    const onChangeFilterCountry = (action: "save" | "close") => {
        if (action === "save") {
            const countriesIds = getIdFromCountriesPaths(selectedCountriesIds);
            compositionRoot.countries.getByIds.execute(countriesIds.slice(0, 2)).run(
                countries => {
                    onFilterChange(countriesIds, "countries");
                    setCountries(countries);
                    setOpenCountry(false);
                },
                error => {
                    snackbar.error(error.message);
                }
            );
        } else {
            setOpenCountry(false);
        }
    };

    const onCountrySelected = (paths: Id[]) => {
        setSelectedCountriesIds(paths);
    };

    const countryNamesString = extractCountriesNames(countries, selectedCountriesIds.length);

    return (
        <FilterContainer>
            <Dialog fullWidth maxWidth="lg" open={openCountry}>
                <CountrySelector
                    api={api}
                    onChange={onCountrySelected}
                    rootIds={currentUser.countries.map(country => country.id)}
                    selectedCountriesIds={selectedCountriesIds}
                />
                <DialogActions>
                    <Button onClick={() => onChangeFilterCountry("close")} color="primary">
                        {i18n.t("Close")}
                    </Button>
                    <Button onClick={() => onChangeFilterCountry("save")} color="primary">
                        {i18n.t("Save")}
                    </Button>
                </DialogActions>
            </Dialog>
            <div>
                <TextField
                    name="countries"
                    label={i18n.t("Countries")}
                    onClick={onClickCountry}
                    title={countryNamesString}
                    value={countryNamesString}
                />
            </div>
            <SelectMultiCheckboxes
                label={i18n.t("Periods")}
                onChange={values => onFilterChange(values, "periods")}
                options={periods}
                value={initialFilters.periods}
            />

            <SelectMultiCheckboxes
                label={i18n.t("Status")}
                onChange={values => onFilterChange(values, "status")}
                options={status}
                value={initialFilters.status || []}
            />

            <SelectMultiCheckboxes
                label={i18n.t("Action")}
                onChange={values => onFilterChange(values, "actions")}
                options={actions}
                value={initialFilters.actions || []}
            />
            <Dropdown
                className="config-form-selector"
                label={i18n.t("Follow Up")}
                items={followUpItems}
                onChange={value => onFilterChange(value, "followUp")}
                value={initialFilters.followUp}
            />
            {showStepFilter ? (
                <SelectMultiCheckboxes
                    label={i18n.t("Step")}
                    onChange={values => onFilterChange(values, "step")}
                    options={step}
                    value={initialFilters.step || []}
                />
            ) : null}
        </FilterContainer>
    );
};

type IssueFiltersProps = {
    initialFilters: IssueFilterState;
    onChange: React.Dispatch<React.SetStateAction<GetIssuesOptions["filters"]>>;
    showStepFilter?: boolean;
};

export type IssueFilterState = {
    countries: Id[];
    actions: Maybe<Id[]>;
    followUp: Maybe<string>;
    periods: Period[];
    status: Maybe<Id[]>;
    step: Maybe<Id[]>;
};

const FilterContainer = styled.div`
    padding: 0 1rem;
    align-items: center;
    display: flex;
    gap: 1rem;
`;
