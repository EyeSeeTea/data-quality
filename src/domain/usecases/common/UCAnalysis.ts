import { FutureData } from "$/data/api-futures";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { QualityAnalysisSection } from "$/domain/entities/QualityAnalysisSection";
import { Id } from "$/domain/entities/Ref";
import { QualityAnalysisRepository } from "$/domain/repositories/QualityAnalysisRepository";

export class UCAnalysis {
    constructor(private analysisRepository: QualityAnalysisRepository) {}

    getById(id: Id): FutureData<QualityAnalysis> {
        return this.analysisRepository.getById(id);
    }

    updateAnalysis(
        analysis: QualityAnalysis,
        sectionName: string,
        totalIssues: number
    ): QualityAnalysis {
        return QualityAnalysis.build({
            ...analysis,
            lastModification: new Date().toISOString(),
            sections: analysis.sections.map(section => {
                if (section.name !== sectionName) return section;
                return QualityAnalysisSection.create({
                    ...section,
                    status: totalIssues === 0 ? "success" : "success_with_issues",
                });
            }),
        }).get();
    }
}
