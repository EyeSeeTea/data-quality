import { FutureData } from "$/data/api-futures";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";

export interface AnalysisSectionRepository {
    get(): FutureData<QualityAnalysisSection[]>;
}
