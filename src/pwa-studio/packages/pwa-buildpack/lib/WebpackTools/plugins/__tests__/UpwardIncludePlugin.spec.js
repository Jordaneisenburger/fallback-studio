const { join } = require('path');
const MemoryFS = require('memory-fs');
const webpack = require('webpack');
const jsYaml = require('js-yaml');
const UpwardIncludePlugin = require('../UpwardIncludePlugin');

const basic3PageProjectDir = join(
    __dirname,
    '__fixtures__/basic-project-3-pages'
);
const basic1PageProjectDir = join(
    __dirname,
    '__fixtures__/basic-project-1-page'
);
const missingUpwardFileDir = join(__dirname, '__fixtures/dupe-root-component');
const badUpwardFileDir = join(__dirname, '__fixtures__/missing-page-types');

const compile = config =>
    new Promise((resolve, reject) => {
        const fs = new MemoryFS();
        const compiler = webpack(config);
        compiler.outputFileSystem = fs;

        compiler.run((err, stats) => {
            if (err || stats.hasErrors()) {
                reject(new Error(err || stats.toString()));
            } else {
                resolve({ fs, stats });
            }
        });
    });

test('merges upward files and resources', async () => {
    const config = {
        context: basic1PageProjectDir,
        entry: {
            main: join(basic1PageProjectDir, 'entry.js')
        },
        output: {
            path: join(basic1PageProjectDir, 'dist')
        },
        plugins: [
            new UpwardIncludePlugin({
                upwardDirs: [basic3PageProjectDir, basic1PageProjectDir]
            })
        ]
    };
    const {
        stats: {
            compilation: { assets }
        }
    } = await compile(config);
    expect(assets['upward.yml']).toBeTruthy();
    expect(jsYaml.safeLoad(assets['upward.yml'].source())).toMatchObject({
        nothing: './nothing.json',
        basicProject1Page: 'foo',
        nonexistentFile: './unknown.pif',
        status: 200
    });

    expect(assets['nothing.json']).toBeTruthy();
    expect(JSON.parse(assets['nothing.json'].source())).toMatchObject({
        nothing: 'to see here'
    });

    expect(assets['robots.txt']).toBeTruthy();
    expect(assets['robots.txt'].source().toString()).toMatch(/Deny/);

    expect(assets).not.toHaveProperty('unknown.pif');
});

test('handles missing upward file', async () => {
    const config = {
        context: missingUpwardFileDir,
        entry: {
            main: join(missingUpwardFileDir, 'entry.js')
        },
        output: {
            path: join(missingUpwardFileDir, 'dist')
        },
        plugins: [
            new UpwardIncludePlugin({
                upwardDirs: [missingUpwardFileDir]
            })
        ]
    };

    // const { stats: { compilation: { assets } } } = await compile(config);
    await expect(compile(config)).rejects.toThrow(/unable to read file/);
});

test('handles bad upward file', async () => {
    const config = {
        context: badUpwardFileDir,
        entry: {
            main: join(badUpwardFileDir, 'entry.js')
        },
        output: {
            path: join(badUpwardFileDir, 'dist')
        },
        plugins: [
            new UpwardIncludePlugin({
                upwardDirs: [badUpwardFileDir]
            })
        ]
    };

    // const { stats: { compilation: { assets } } } = await compile(config);
    await expect(compile(config)).rejects.toThrow(/error parsing/);
});
