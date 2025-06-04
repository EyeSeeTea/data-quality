import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { Id } from "@eyeseetea/d2-api";
import { FutureData } from "$/data/api-futures";
import { QualityAnalysisRepository } from "$/domain/repositories/QualityAnalysisRepository";

export class GetAnalysisByIdUseCase {
    constructor(private qualityAnalysisRepository: QualityAnalysisRepository) {}

    execute(id: Id): FutureData<QualityAnalysis> {
        return this.qualityAnalysisRepository.getById(id);
    }
}
