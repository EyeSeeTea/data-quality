import React from "react";
import { Button, TextField } from "@material-ui/core";
import { Dropdown, OrgUnitsSelector, useSnackbar } from "@eyeseetea/d2-ui-components";

import i18n from "$/utils/i18n";
import { useAppContext } from "$/webapp/contexts/app-context";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { Maybe } from "$/utils/ts-utils";
import { periods } from "$/webapp/components/analysis-filter/AnalysisFilter";
import { Id } from "$/domain/entities/Ref";
import _ from "$/domain/entities/generic/Collection";
import { Country } from "$/domain/entities/Country";
import styled from "styled-components";
import { getDefaultModules } from "$/data/common/D2Module";

export function getIdFromCountriesPaths(paths: string[]): string[] {
    return _(paths)
        .map(path => {
            return _(path.split("/")).last() || undefined;
        })
        .compact()
        .value();
}

export function useCountries(props: UseCountriesProps) {
    const { ids } = props;
    const { compositionRoot } = useAppContext();
    const snackbar = useSnackbar();
    const [countries, setCountries] = React.useState<Country[]>();

    React.useEffect(() => {
        if (ids.length === 0) return;
        compositionRoot.countries.getByIds.execute(ids).run(
            result => {
                setCountries(result);
            },
            err => {
                snackbar.error(err.message);
            }
        );
    }, [compositionRoot.countries.getByIds, ids, snackbar]);

    return { countries };
}

export const ConfigurationForm: React.FC<ConfigurationFormProps> = React.memo(props => {
    const { initialData, onSave } = props;
    const { api, currentUser, metadata } = useAppContext();
    const { countries } = useCountries({ ids: initialData.countriesAnalysis });
    const [formData, setFormData] = React.useState<QualityAnalysis>(() => {
        return initialData;
    });
    const [selectedOrgUnits, setSelectedOrgUnits] = React.useState<Id[]>([]);
    const inputRef = React.useRef<HTMLInputElement>();

    React.useEffect(() => {
        if (countries && countries.length > 0) {
            setSelectedOrgUnits(countries.map(country => country.path));
        }
    }, [countries]);

    const modules = getDefaultModules(metadata);

    const moduleItems = modules.map(module => ({
        value: module.id,
        text: module.name,
    }));

    const onFormSubmit = React.useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!formData) return undefined;
            if (!inputRef.current?.value) return undefined;
            if (formData) {
                const newValue = QualityAnalysis.build({
                    ...formData,
                    name: inputRef.current.value,
                    countriesAnalysis: getIdFromCountriesPaths(selectedOrgUnits),
                }).get();
                onSave(newValue);
            }
        },
        [formData, onSave, selectedOrgUnits]
    );

    const onChangeModule = (value: Maybe<string>) => {
        const selectedModule = modules.find(module => module.id === value);
        if (selectedModule) {
            setFormData(prev => {
                return QualityAnalysis.build({
                    ...prev,
                    module: { ...selectedModule, dataElements: [], disaggregations: [] },
                }).get();
            });
        }
    };

    const onChangePeriod = (value: Maybe<string>, attributeName: string) => {
        if (!value) return false;
        setFormData(prev => {
            return QualityAnalysis.build({ ...prev, [attributeName]: value }).get();
        });
    };

    const onOrgUnitsChange = (value: Id[]) => {
        setSelectedOrgUnits(value);
    };

    const disableSave = QualityAnalysis.hasExecutedSections(formData);
    const selectorClass = disableSave ? "config-form-selector disabled" : "config-form-selector";

    return (
        <Form onSubmit={onFormSubmit}>
            <FormControlsContainer>
                <StyledTextField
                    inputRef={inputRef}
                    name="name"
                    label={i18n.t("Name")}
                    defaultValue={formData?.name}
                />
                <DropdownWrapper>
                    <Dropdown
                        className={selectorClass}
                        hideEmpty
                        items={moduleItems}
                        onChange={onChangeModule}
                        value={formData?.module.id}
                        label={i18n.t("Module")}
                    />

                    <Dropdown
                        className={selectorClass}
                        hideEmpty
                        items={periods}
                        onChange={value => onChangePeriod(value, "startDate")}
                        value={formData?.startDate}
                        label={i18n.t("Start Date")}
                    />

                    <Dropdown
                        className={selectorClass}
                        hideEmpty
                        items={periods}
                        onChange={value => onChangePeriod(value, "endDate")}
                        value={formData?.endDate}
                        label={i18n.t("End Date")}
                    />
                </DropdownWrapper>
            </FormControlsContainer>

            <OrgUnitContainer $disabled={disableSave}>
                <OrgUnitsSelector
                    api={api}
                    onChange={onOrgUnitsChange}
                    selected={selectedOrgUnits}
                    levels={[1, 2, 3]}
                    selectableLevels={[2, 3]}
                    rootIds={currentUser.countries.map(country => country.id)}
                    withElevation={false}
                />
            </OrgUnitContainer>

            <ActionsContainer>
                <Button type="submit" variant="contained" color="primary">
                    {i18n.t("Save Config Analysis")}
                </Button>
            </ActionsContainer>
        </Form>
    );
});

type ConfigurationFormProps = {
    initialData: QualityAnalysis;
    onSave: (data: QualityAnalysis) => void;
};

type UseCountriesProps = { ids: Id[] };

const Form = styled.form``;

const FormControlsContainer = styled.div`
    display: flex;
    gap: 1.5rem;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    margin-block-end: 1.25rem;
    flex-wrap: wrap;
`;

const DropdownWrapper = styled.div`
    display: flex;
    gap: 1rem;
`;

const StyledTextField = styled(TextField)`
    width: 40%;
    margin-inline-end: 1rem;
`;

const OrgUnitContainer = styled.div<{ $disabled?: boolean }>`
    pointer-events: ${props => (props.$disabled ? "none" : "auto")};
    opacity: ${props => (props.$disabled ? "0.7" : "1")};
`;

const ActionsContainer = styled.div`
    text-align: right;
`;
