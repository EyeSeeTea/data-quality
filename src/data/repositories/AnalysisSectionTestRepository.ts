import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import { Future } from "$/domain/entities/generic/Future";
import { AnalysisSectionRepository } from "$/domain/repositories/AnalysisSectionRepository";
import { FutureData } from "$/data/api-futures";

export class AnalysisSectionTestRepository implements AnalysisSectionRepository {
    get(): FutureData<QualityAnalysisSection[]> {
        return Future.success([]);
    }
}
