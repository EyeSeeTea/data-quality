import { FutureData } from "$/data/api-futures";
import {
    QualityAnalysisOptions,
    QualityAnalysisPaginated,
    QualityAnalysisRepository,
} from "$/domain/repositories/QualityAnalysisRepository";

export class GetQualityAnalysisUseCase {
    constructor(private qualityAnalysisRepository: QualityAnalysisRepository) {}

    execute(options: QualityAnalysisOptions): FutureData<QualityAnalysisPaginated> {
        return this.qualityAnalysisRepository.get(options);
    }
}
