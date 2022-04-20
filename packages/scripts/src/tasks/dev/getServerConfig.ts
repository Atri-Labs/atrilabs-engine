import { ServerConfig } from "../../shared/types";

export default function getServerConfig(): ServerConfig {
  return {
    host: "localhost",
    port: 4000,
  };
}
