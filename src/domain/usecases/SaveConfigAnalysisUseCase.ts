import { Id } from "$/domain/entities/Ref";
import { FutureData } from "$/data/api-futures";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { QualityAnalysisRepository } from "$/domain/repositories/QualityAnalysisRepository";
import { getErrors } from "$/domain/entities/generic/Errors";

export class SaveConfigAnalysisUseCase {
    constructor(private qualityAnalysisRepository: QualityAnalysisRepository) {}

    execute(options: SaveQualityAnalysisOptions): FutureData<void> {
        return this.getAnalysis(options.qualityAnalysis.id).flatMap(analysis => {
            const wasExecuted = QualityAnalysis.hasExecutedSections(analysis);
            const qualityAnalysisToSave = wasExecuted
                ? QualityAnalysis.build({ ...analysis, name: options.qualityAnalysis.name }).get()
                : this.updateConfigAnalysis(options.qualityAnalysis);
            return this.qualityAnalysisRepository.save([qualityAnalysisToSave]);
        });
    }

    private updateConfigAnalysis(analysis: QualityAnalysis): QualityAnalysis {
        return QualityAnalysis.updateConfiguration(analysis).match({
            success: analysis => analysis,
            error: errors => {
                const errorMessage = getErrors(errors);
                throw new Error(errorMessage);
            },
        });
    }

    private getAnalysis(id: Id): FutureData<QualityAnalysis> {
        return this.qualityAnalysisRepository.getById(id);
    }
}

type SaveQualityAnalysisOptions = { qualityAnalysis: QualityAnalysis };
