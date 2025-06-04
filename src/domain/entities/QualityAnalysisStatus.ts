export const qualityAnalysisStatus = ["In Progress", "Completed"] as const;
export type QualityAnalysisStatus = (typeof qualityAnalysisStatus)[number];
