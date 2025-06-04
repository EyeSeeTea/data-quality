import { FutureData } from "$/data/api-futures";
import { Id } from "$/domain/entities/Ref";
import { QualityAnalysisRepository } from "$/domain/repositories/QualityAnalysisRepository";
import { Future } from "$/domain/entities/generic/Future";

export class RemoveQualityUseCase {
    constructor(private qualityAnalysisRepository: QualityAnalysisRepository) {}

    execute(qualityAnalysisIds: Id[]): FutureData<void> {
        const concurrencyRequest = 5;
        const $requests = Future.parallel(
            qualityAnalysisIds.map(issue => this.qualityAnalysisRepository.remove(issue)),
            { concurrency: concurrencyRequest }
        );
        return $requests.flatMap(() => {
            return Future.success(undefined);
        });
    }
}
