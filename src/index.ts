import {createClient} from 'redis';
import { downloadS3folder } from './aws.js';
const subscriber = createClient();
subscriber.connect();

async function main(){
    while(1){
        const response = await subscriber.brPop(
            'build-queue', 
            0
        );
        console.log(response);
        downloadS3folder(`${response?.element}/`)
    }

}

main();