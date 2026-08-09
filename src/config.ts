import fs from "fs";
import os from "os";
import path from "path";

type Config = {
    dbUrl: string,
    currentUserName: string,
}

export function setUser() {

}

export function readConfig() {

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