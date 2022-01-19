import path from 'path';
import download from 'download';
import fs from 'fs';
import os from 'os';
(async function build() {
    let acc = "accumulate"

    if (os.platform() === 'win32') {
        console.log('detected win32, not tested on windows')
        acc += ".exe"
    }

    const inBin = path.join(process.cwd(), 'node_modules', '.bin', acc);

    if (!fs.existsSync(inBin)) {
        console.log("accumulate not found, downloading latest release");

        const archMap = {
            'x64': 'amd64',
            'x86': '386'
        };

        const osMap = {
            'darwin': 'darwin',
            'linux': 'linux',
            'win32': 'windows'
        };

        // await download(`https://github.com/hawyar/accumulate/releases/download/`,{
        //     extract: true,
        // }).catch(err => {
        //     console.error(err);
        //     process.exit(1);
        // });
        //
        // console.log('downloaded ' + acc);
        //
        // fs.renameSync(path.join(process.cwd(), acc, 'mlr'), inBin);
        // fs.rmdirSync(path.join(process.cwd(), acc), {
        //     recursive: true
        // });
        // console.log("cleaning up")
    }
    console.log(acc + " is already in " + inBin);
})();
