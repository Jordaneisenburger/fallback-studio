require('dotenv').config();
const debug = require('../util/debug').makeFileLogger(__filename);
const debugErrorMiddleware = require('debug-error-middleware').express;
const {
    default: playgroundMiddleware
} = require('graphql-playground-middleware-express');
const chalk = require('chalk');
const configureHost = require('../Utilities/configureHost');
const portscanner = require('portscanner');
const { readFile: readFileAsync } = require('fs');
const { promisify } = require('util');
const readFile = promisify(readFileAsync);
const path = require('path');
const boxen = require('boxen');
const webpack = require('webpack');
const UpwardDevServerPlugin = require('./plugins/UpwardDevServerPlugin');
const addImgOptMiddleware = require('../Utilities/addImgOptMiddleware');

// We only need the HTTP server to detect if the host is SSL or not.
const HttpsServer = require('https').Server;
const isHttpsServer = server => server instanceof HttpsServer;

const PWADevServer = {
    async configure(devServerConfig, webpackConfig) {
        debug('configure() invoked', devServerConfig);
        const {
            devServer = {},
            customOrigin = {},
            imageService = {},
            backendUrl,
            graphqlPlayground,
            upwardPath = 'upward.yml'
        } = devServerConfig;

        const { context } = webpackConfig;

        const webpackDevServerOptions = {
            contentBase: false, // UpwardDevServerPlugin serves static files
            compress: true,
            hot: true,
            watchOptions: {
                // polling is CPU intensive - provide the option to turn it on if needed
                poll: !!parseInt(devServer.watchOptionsUsePolling) || false
            },
            // 'host' and 'port' here will be replaced with any custom origin.
            host: devServer.host || '0.0.0.0',
            port:
                devServer.port || (await portscanner.findAPortNotInUse(10000)),
            stats: 'normal',
            after(app, server) {
                app.use(debugErrorMiddleware());
                server.middleware.waitUntilValid(() => {
                    // We can try to set the hostname and port for the dev
                    // server all we want, but the only reliable way to know
                    // what it is is to detect it once it's mounted and
                    // listening. This should cover all use cases.
                    let url;
                    // if an override URL is set, then the URL constructor will
                    // parse it. This is the case where webpack-dev-server is
                    // running in a container and doesn't know its public URL,
                    // so the config has to supply it.
                    try {
                        url = new URL(webpackDevServerOptions.publicPath).href;
                    } catch (e) {
                        // otherwise, put the URL together from what's available to us in the closure.
                        const scheme = isHttpsServer(server.listeningApp)
                            ? 'https://'
                            : 'http://';
                        const detectedAddress = server.listeningApp.address();
                        const hostname =
                            server.hostname || detectedAddress.address;
                        url = new URL(
                            webpackConfig.output.publicPath,
                            scheme + hostname
                        );
                        url.port = detectedAddress.port;
                    }
                    let readyNotice = chalk.green(
                        `PWADevServer ready at ${chalk.greenBright.underline(
                            url.href
                        )}`
                    );
                    if (graphqlPlayground) {
                        readyNotice +=
                            '\n' +
                            chalk.blueBright(
                                `GraphQL Playground ready at ${chalk.blueBright.underline(
                                    new URL('/graphiql', url.origin).href
                                )}`
                            );
                    }
                    console.log(
                        boxen(readyNotice, {
                            borderColor: 'gray',
                            float: 'center',
                            align: 'center',
                            margin: 1,
                            padding: 1
                        })
                    );
                });
            },
            before(app) {
                addImgOptMiddleware(app, {
                    ...imageService,
                    backendUrl
                });
            }
        };
        if (customOrigin.enabled) {
            if (devServer.host) {
                const { host } = devServer;
                console.warn(
                    `Custom origins are enabled for this project, but the environment is overriding the custom hostname with ${
                        devServer.host
                    }`
                );
                webpackDevServerOptions.host = host;
                webpackDevServerOptions.port = devServer.port || 0;
            } else {
                const customOriginConfig = await configureHost(
                    Object.assign(customOrigin, {
                        dir: context,
                        interactive: false
                    })
                );
                if (!customOriginConfig) {
                    console.warn(
                        chalk.yellowBright(
                            `Custom origins are enabled for this project, but one has not yet been set up. Run ${chalk.whiteBright(
                                'buildpack create-custom-origin <projectRoot>'
                            )} to initialize a custom origin.`
                        )
                    );
                } else {
                    const { hostname, ssl, ports } = customOriginConfig;
                    webpackDevServerOptions.host = hostname;
                    webpackDevServerOptions.https = ssl;

                    const requestedPort = devServer.port || ports.development;
                    if (
                        (await portscanner.checkPortStatus(requestedPort)) ===
                        'closed'
                    ) {
                        webpackDevServerOptions.port = requestedPort;
                    } else {
                        console.warn(
                            chalk.yellowBright(
                                '\n' +
                                    debug.errorMsg(
                                        `This project's dev server is configured to run at ${hostname}:${requestedPort}, but port ${requestedPort} is in use. The dev server will run temporarily on port ${chalk.underline.whiteBright(
                                            webpackDevServerOptions.port
                                        )}; you may see inconsistent ServiceWorker behavior.`
                                    ) +
                                    '\n'
                            )
                        );
                    }
                }
            }
        }

        if (graphqlPlayground) {
            const endpoint = '/graphql';

            const oldBefore = webpackDevServerOptions.before;
            webpackDevServerOptions.before = (app, server) => {
                oldBefore(app, server);
                let middleware;
                const gatheringQueryTabs = new Promise((resolve, reject) => {
                    const { compiler } = server.middleware.context;
                    compiler.hooks.done.tap(
                        'PWADevServer',
                        async ({ stats }) => {
                            /**
                             * Stats in an array because we have 2 webpack child
                             * compilations, 1 for client and other for service worker.
                             */
                            const queryFilePaths = [];
                            for (const { compilation } of stats) {
                                for (const filename of compilation.fileDependencies) {
                                    if (filename.endsWith('.graphql')) {
                                        queryFilePaths.push(filename);
                                    }
                                }
                            }
                            try {
                                resolve(
                                    await Promise.all(
                                        queryFilePaths.map(async queryFile => {
                                            const query = await readFile(
                                                queryFile,
                                                'utf8'
                                            );
                                            const name = path.relative(
                                                context,
                                                queryFile
                                            );
                                            return {
                                                endpoint,
                                                name,
                                                query
                                            };
                                        })
                                    )
                                );
                            } catch (e) {
                                reject(e);
                            }
                        }
                    );
                });
                /* istanbul ignore next: dummy next() function not testable */
                const noop = () => {};
                app.get('/graphiql', async (req, res) => {
                    if (!middleware) {
                        middleware = playgroundMiddleware({
                            endpoint,
                            tabs: await gatheringQueryTabs
                        });
                    }
                    // this middleware has a bad habit of calling next() when it
                    // should not, so let's give it a noop next()
                    middleware(req, res, noop);
                });
            };
        }

        // now decorate the webpack config object itself!
        webpackConfig.devServer = webpackDevServerOptions;

        const plugins = webpackConfig.plugins || (webpackConfig.plugins = []);
        plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new UpwardDevServerPlugin(
                webpackDevServerOptions,
                process.env,
                path.resolve(webpackConfig.context, upwardPath)
            )
        );

        return webpackDevServerOptions;
    }
};
module.exports = PWADevServer;
