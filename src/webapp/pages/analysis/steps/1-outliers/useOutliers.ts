import React from "react";

import { useAppContext } from "$/webapp/contexts/app-context";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { Id } from "$/domain/entities/Ref";
import { Maybe } from "$/utils/ts-utils";

export const thresholdList = [
    { value: "1", text: "1.0" },
    { value: "1.5", text: "1.5" },
    { value: "2", text: "2.0" },
    { value: "2.5", text: "2.5" },
    { value: "3", text: "3.0" },
    { value: "3.5", text: "3.5" },
    { value: "4", text: "4.0" },
    { value: "4.5", text: "4.5" },
    { value: "5", text: "5.0" },
];

export const algorithmList = [
    { value: "Z_SCORE", text: "Z-score" },
    { value: "MOD_Z_SCORE", text: "Modified Z-score" },
    { value: "MIN_MAX", text: "Minmax values" },
];

export function useAnalysisOutlier(props: UseRunAnalysisProps) {
    const { onSucess } = props;
    const { compositionRoot } = useAppContext();
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<Maybe<string>>(undefined);

    const runAnalysisOutlier = React.useCallback(
        (algorithm: string, analysisId: Id, sectionId: Id, threshold: string) => {
            setLoading(true);
            compositionRoot.outlier.run
                .execute({
                    sectionId: sectionId,
                    algorithm: algorithm,
                    qualityAnalysisId: analysisId,
                    threshold: threshold,
                })
                .run(
                    qualityAnalysis => {
                        setLoading(false);
                        onSucess(qualityAnalysis);
                    },
                    err => {
                        setError(err.message);
                        setLoading(false);
                    }
                );
        },
        [compositionRoot.outlier.run, onSucess]
    );

    return {
        runAnalysisOutlier,
        isLoading,
        error,
    };
}

type UseRunAnalysisProps = { onSucess: (qualityAnalysis: QualityAnalysis) => void };
