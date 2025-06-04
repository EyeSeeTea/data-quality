import { FeedbackOptions } from "@eyeseetea/feedback-component";

export const appConfig: AppConfig = {
    appKey: "data-quality",
    appearance: {
        showShareButton: true,
    },
    feedback: {
        repositories: {
            clickUp: {
                // https://app.clickup.com/${workspace}/v/b/N-${listId}-M
                // Web development -> Common resources -> data-quality
                listId: "42597084",
                title: "[User feedback] {title}",
                body: "## dhis2\n\nUsername: {username}\n\n{body}",
            },
        },
        layoutOptions: {
            buttonPosition: "bottom-start",
        },
    },
};

export interface AppConfig {
    appKey: string;
    appearance: {
        showShareButton: boolean;
    };
    feedback?: FeedbackOptions;
}
