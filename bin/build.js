import path from 'path';
import esbuild from 'esbuild';
import {nodeExternalsPlugin} from 'esbuild-node-externals'

(async function build() {
    await esbuild.build({
        entryPoints: [path.join(process.cwd(), "lib/client.ts")],
        bundle: true,
        minify: true,
        sourcemap: true,
        target: 'es6',
        platform: 'node',
        format: 'esm',
        outfile: path.join(process.cwd(), "dist/accumulate.js"),
        plugins: [nodeExternalsPlugin()],
    }).catch(err => {
        console.error(err);
        process.exit(1);
    }).finally(() => {
        console.log('building accumulate-js ');
    });
})();
