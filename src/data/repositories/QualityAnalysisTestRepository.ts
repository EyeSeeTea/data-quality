import { Future } from "../../domain/entities/generic/Future";
import {
    QualityAnalysisPaginated,
    QualityAnalysisRepository,
} from "../../domain/repositories/QualityAnalysisRepository";
import { FutureData } from "../api-futures";

export class QualityAnalysisTestRepository implements QualityAnalysisRepository {
    save(): FutureData<any> {
        throw new Error("Method not implemented.");
    }
    get(): FutureData<QualityAnalysisPaginated> {
        return Future.success({
            pagination: { page: 1, total: 10, pageSize: 5, pageCount: 2 },
            rows: [],
        });
    }
}
