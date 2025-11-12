import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// aws-sdk (v2) is a CommonJS package. In an ES module environment we must
// load it using createRequire so Node provides the CommonJS exports correctly.
const require = createRequire(import.meta.url);
const { S3 } = require("aws-sdk");

const s3 = new S3({
    accessKeyId: "626163fd29e53681952aea9cafb007b3",
    secretAccessKey: "11cc67ad488e8855b0485f17c944a11481cef3bbdfc3e1e71ba91c901c7e1372",
    endpoint: "https://b38b588577e718ca577b72882ac1f6a0.r2.cloudflarestorage.com"
})


export async function downloadS3folder(prefix:string) {
    const allfiles= await s3.listObjectsV2({
        Bucket:'vercel', 
        Prefix:prefix, 
    }).promise()

    const allPromises=allfiles.Contents?.map(async({Key}: {Key?: string})=>{
        return new Promise(async(resolve)=>{
            if(!Key){
                resolve("");
                return 
            }
            const findOutputPath=path.join(__dirname, `repo/${Key}`);
            const outputFile=fs.createWriteStream(findOutputPath);
            const dirName= path.dirname(findOutputPath);
            if(!fs.existsSync(dirName)){
                fs.mkdirSync(dirName, {recursive:true})
            }
            s3.getObject({
                Bucket:'vercel', 
                Key
            }).createReadStream().pipe(outputFile).on("finish", ()=>{
                resolve('');
            })
        })
    })||[]
        console.log('awaiting')
        interface S3Object {
            Key?: string;
        }

        interface ListObjectsResponse {
            Contents?: S3Object[];
        }
        //(x): x is Promise<string> => x !== undefined)

        await Promise.all(allPromises?.filter((x: Promise<string> | undefined): x is Promise<string> => x !== undefined) ?? []);
    
}

 
export function copyFinalDist(id:string){
    const folderPath= path.join(__dirname, `repo/${id}/dist`);
    const allFiles =generate_all_paths(folderPath);
    allFiles.forEach(file=>{
        uploadFile(`dist/${id}`+ file.slice(folderPath.length+1), file)
    })
}

export const generate_all_paths = (folderPath: string) => {
    let response: string[] = []
    const allFile_Folders = fs.readdirSync(folderPath)
    allFile_Folders.forEach((file) => {
        const fullfilePath = path.join(folderPath, file)

        if (fs.statSync(fullfilePath).isDirectory()) {
            response = response.concat(generate_all_paths(fullfilePath))

        }
        else {
            response.push(fullfilePath)
        }
    })
    return response;
}



export const uploadFile = async (fileName: string, localfilePath: string) => {

    const fileContent = fs.readFileSync(localfilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName
    }).promise();
    console.log(response)

}