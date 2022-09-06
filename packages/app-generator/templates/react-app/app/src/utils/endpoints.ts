import AppInfo from "../../../atri-app-info.json";

const prefixUrl = AppInfo["prefixUrl"] ?? "";

export const eventHandlerEndpoint = `${prefixUrl}/event-handler`;

export const formEventHandlerEndpoint = `${prefixUrl}/event-in-form-handler`;

export const pageRequestEndpoint = `${prefixUrl}/handle-page-request`;
