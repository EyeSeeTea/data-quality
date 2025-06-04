import _ from "lodash";

import { IssueExportRepository } from "$/domain/repositories/IssueExportRepository";
import { FutureData } from "$/data/api-futures";
import { Future } from "$/domain/entities/generic/Future";

export class IssueSpreadSheetTestRepository implements IssueExportRepository {
    export(): FutureData<void> {
        return Future.success(undefined);
    }
}
