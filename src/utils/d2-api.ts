import { D2Api } from "$/types/d2-api";

interface LocalInstance {
    type: "local";
    url: string;
}

interface ExternalInstance {
    type: "external";
    url: string;
    username: string;
    password: string;
}

export type DhisInstance = LocalInstance | ExternalInstance;

export function getD2APiFromInstance(instance: DhisInstance) {
    return new D2Api({
        baseUrl: instance.url,
        auth:
            instance.type === "external"
                ? { username: instance.username, password: instance.password }
                : undefined,
        backend: "fetch",
    });
}
