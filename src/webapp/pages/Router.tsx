import { HashRouter, Route, Switch } from "react-router-dom";
import { AnalysisPage } from "./analysis/AnalysisPage";
import i18n from "$/utils/i18n";
import { DashboardPage } from "./dashboard/DashboardPage";

export function Router() {
    return (
        <HashRouter>
            <Switch>
                <Route
                    path="/analysis/:id"
                    render={() => <AnalysisPage name={i18n.t("Analysis")} />}
                />
                {/* Default route */}
                <Route
                    path="/"
                    render={() => <DashboardPage name={i18n.t("Data Quality Analysis")} />}
                />
            </Switch>
        </HashRouter>
    );
}
