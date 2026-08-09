import { readConfig, setUser } from "./config";

function main() {
    setUser("Mark");
    const cfg = readConfig();
    console.log(cfg);
}

main();