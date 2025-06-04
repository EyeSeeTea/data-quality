import { D2Api } from "$/types/d2-api";
import { FutureData, apiToFuture } from "$/data/api-futures";
import { Id } from "$/domain/entities/Ref";
import _ from "$/domain/entities/generic/Collection";
import { CategoryOption } from "$/domain/entities/CategoryOption";
import { Maybe } from "$/utils/ts-utils";

export class D2CategoryOption {
    constructor(private api: D2Api) {}

    getByIds(ids: Id[]): FutureData<CategoryOption[]> {
        return apiToFuture(
            this.api.models.categoryOptionCombos
                .get({
                    fields: {
                        id: true,
                        displayFormName: true,
                        displayName: true,
                        displayShortName: true,
                    },
                    filter: { id: { in: ids } },
                })
                .map(d2Response => {
                    return d2Response.data.objects.map(d2CategoryOption => {
                        return { id: d2CategoryOption.id, name: this.getName(d2CategoryOption) };
                    });
                })
        );
    }

    private getName(d2Name: D2TranslatioName): string {
        const name = d2Name.displayShortName || d2Name.displayFormName || d2Name.displayName;
        if (name === "default") return "Total";
        return name || "";
    }
}

type D2TranslatioName = {
    displayShortName: Maybe<string>;
    displayFormName: Maybe<string>;
    displayName: Maybe<string>;
};
