import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { ExamplePage } from "./example/ExamplePage";
import { AnalysisPage } from "./analysis/AnalysisPage";
import { LandingPage } from "./landing/LandingPage";

export function Router() {
    return (
        <HashRouter>
            <Switch>
                <Route
                    path="/for/:name?"
                    render={({ match }) => <ExamplePage name={match.params.name ?? "Stranger"} />}
                />
                <Route path="/analysis" render={() => <AnalysisPage name="Analysis Page" />} />
                {/* Default route */}
                <Route render={() => <LandingPage />} />
            </Switch>
        </HashRouter>
    );
}
