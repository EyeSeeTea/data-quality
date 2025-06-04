import { FutureData } from "$/data/api-futures";
import { Id } from "$/domain/entities/Ref";
import { NamedRef } from "@eyeseetea/d2-logger/domain/entities/Base";
import { ModuleRepository } from "$/domain/repositories/ModuleRepository";
import { Future } from "$/domain/entities/generic/Future";
import _ from "$/domain/entities/generic/Collection";
import { DataElement } from "$/domain/entities/DataElement";

export class GetDisaggregationsUseCase {
    constructor(private moduleRepository: ModuleRepository) {}

    execute(moduleId: Id): FutureData<NamedRef[]> {
        return this.moduleRepository.getByIds([moduleId]).flatMap(modules => {
            const module = modules[0];
            if (!module) return Future.error(new Error(`Cannot find module: ${moduleId}`));
            const dataElements = this.groupDataElements(module.dataElements);
            const allDisaggregations = dataElements.flatMap((dataElement): NamedRef[] => {
                const { dataElementParent } = dataElement;
                if (!dataElementParent.disaggregation) return [];
                const disaggregationName = dataElementParent.name.split(" - ")[2];

                if (!disaggregationName) return [];
                return [
                    {
                        id: dataElementParent.disaggregation.id,
                        name: disaggregationName !== "default" ? disaggregationName : "Total",
                    },
                ];
            });
            const uniqueDisaggregations = _(allDisaggregations)
                .uniqBy(d => d.id)
                .sortBy(d => d.name)
                .value();
            return Future.success(uniqueDisaggregations);
        });
    }

    private groupDataElements(dataElements: DataElement[]): DataElementsLevel[] {
        const parents = dataElements.filter(dataElementParent => {
            const nivel = dataElementParent.name.split(" - ")[0];
            if (!nivel) return false;
            return Number.isInteger(parseFloat(nivel)) && parseFloat(nivel) <= 3;
        });

        const result = parents.map(dataElementParent => {
            const parentLevel = dataElementParent.name.split(" - ")[0];
            const dataElementChildren = dataElements.filter(dataElementChild => {
                const level = dataElementChild.name.split(" - ")[0];
                if (!level) return false;
                const splitLevel = level.split(".");
                return (
                    splitLevel.length === 2 &&
                    splitLevel[0] === parentLevel &&
                    dataElementParent.disaggregation?.id === dataElementChild.disaggregation?.id
                );
            });

            return { dataElementParent: dataElementParent, children: dataElementChildren };
        });

        return result;
    }
}

type DataElementsLevel = {
    dataElementParent: DataElement;
    children: DataElement[];
};
