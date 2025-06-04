import { GetIssuesOptions } from "$/domain/repositories/IssueRepository";

export const initialFilters: GetIssuesOptions["filters"] = {
    actions: [],
    countries: [],
    periods: [],
    name: undefined,
    status: [],
    analysisIds: undefined,
    sectionId: "",
    id: undefined,
    followUp: undefined,
    step: [],
    search: undefined,
};

export function mapIssueStatusAndActionToColor(buttonStatus: string) {
    switch (buttonStatus) {
        case "Success":
            return "success";
        case "In treatment":
            return "success";
        case "Completed":
            return "done";
        case "Resolved":
            return "done";
        case "Dismissed":
            return "inactive";
        case "Waiting for focal point ":
            return "warning";
        default:
            return "default";
    }
}
