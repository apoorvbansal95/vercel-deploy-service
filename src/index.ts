import {createClient} from 'redis';
import { downloadS3folder } from './aws.js';
import { buildProject } from './utils.js';
const subscriber = createClient();
subscriber.connect();

async function main(){
    while(1){
        const response = await subscriber.brPop(
            'build-queue', 
            0
        );
        console.log(response);
        await downloadS3folder(`${response?.element}/`);
        console.log("downloaded")
        //@ts-ignore
        await buildProject(response?.element)
    }

}

main();