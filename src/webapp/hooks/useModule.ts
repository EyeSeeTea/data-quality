import React from "react";
import { useAppContext } from "$/webapp/contexts/app-context";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { Module } from "$/domain/entities/Module";

export function useModules() {
    const { compositionRoot } = useAppContext();
    const snackBar = useSnackbar();
    const [modules, setModules] = React.useState<Module[]>([]);

    React.useEffect(() => {
        compositionRoot.modules.get.execute().run(setModules, err => {
            snackBar.error(err.message);
        });
    }, [compositionRoot.modules.get, snackBar]);

    return modules;
}
