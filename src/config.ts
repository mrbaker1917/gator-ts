import fs from "fs";
import os from "os";
import path from "path";

type Config = {
    dbUrl: string,
    currentUserName: string,
}

export function setUser(username: string): void {
    const config = readConfig();
    config.currentUserName = username;
    writeConfig(config);
}

export function readConfig(): Config {
    const configContent = fs.readFileSync(getConfigFilePath(), "utf8");
    const rawConfig = JSON.parse(configContent);
    return validateConfig(rawConfig);
}

function getConfigFilePath() {
    const base_path = os.homedir()
    return path.join(base_path, "/.gatorconfig.json")
}

function writeConfig(cfg: Config): void {
    const db_url = cfg.dbUrl;
    const current_user_name = cfg.currentUserName;

    fs.writeFileSync(getConfigFilePath(), JSON.stringify({"db_url": db_url, "current_user_name": current_user_name}));
}

function validateConfig(rawConfig: any): Config {
    if (!rawConfig["db_url"]) {
        throw new Error("Invalid config: dbUrl is required");
    }
    return {
        dbUrl: rawConfig["db_url"],
        currentUserName: rawConfig["current_user_name"] || ""
    };
}