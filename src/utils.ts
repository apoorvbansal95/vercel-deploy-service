import {exec, spawn} from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function buildProject(id :string){
    return new Promise((resolve)=>{
        console.log("__dirname: ", __dirname)
        const child =exec(`cd ${path.join(__dirname, `repo/${id}`)} && npm install && npm run build`)
        child.stdout?.on('data', function(data){
            console.log('stdout: ' +data)
        })

        child.stderr?.on('data', function(data){
            console.log("stderr: " + data)
        })

        child.on('close', function(code){
            resolve("");
        });
    })
}