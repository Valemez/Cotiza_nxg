import { URL, getData } from './env.js';

const info = await getData(URL+'/src/php/api.php/informacion');

console.log(info);