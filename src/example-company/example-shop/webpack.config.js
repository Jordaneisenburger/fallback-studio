const { configureWebpack } = require('../../pwa-studio/packages/pwa-buildpack/lib/index');
const NormalModuleOverridePlugin = require('./normalModuleOverrideWebpackPlugin');
const componentOverrideMapping = require('./componentOverrideMapping');

const path = require('path');

const parentTheme = path.resolve(
    process.cwd() + '/../../pwa-studio/packages/venia-concept'
);

module.exports = async env => {
    const config = await configureWebpack({
        context: __dirname,
        vendor: [
            'apollo-cache-inmemory',
            'apollo-cache-persist',
            'apollo-client',
            'apollo-link-context',
            'apollo-link-http',
            'informed',
            'react',
            'react-apollo',
            'react-dom',
            'react-feather',
            'react-redux',
            'react-router-dom',
            'redux',
            'redux-actions',
            'redux-thunk'
        ],
        special: {
            '@magento/venia-concept': {
                cssModules: true,
                esModules: true,
                graphqlQueries: true,
                rootComponents: true,
                upward: true
            },
            '@magento/peregrine': {
                esModules: true
            },
            '@fallback-studio/example-shop': {
                cssModules: true,
                esModules: true,
                graphqlQueries: true,
                rootComponents: false,
                upward: false
            },
            // '@magento/venia-ui': {
            //     cssModules: true,
            //     esModules: true,
            //     graphqlQueries: true,
            //     rootComponents: true,
            //     upward: true
            // }
        },
        env
    });

    // configureWebpack() returns a regular Webpack configuration object.
    // You can customize the build by mutating the object here, as in
    // this example:
    config.module.noParse = [/braintree\-web\-drop\-in/];
    // Since it's a regular Webpack configuration, the object supports the
    // `module.noParse` option in Webpack, documented here:
    // https://webpack.js.org/configuration/module/#modulenoparse

    config.module.rules.push({
        test: /\.scss$/,
        // Exclude files from these locations
        exclude: /node_modules|bower_components/,
        // fallback: 'style-loader',
        use: [
            // Default style loader
            'style-loader',
            // CSS loader
            {
                loader: 'css-loader',
                // Scepcify options for the CSS loader
                options: {
                    // Root - must be specified in order to resolve URLs
                    // in css files and pick up on any images and fonts.
                    //root: paths.appSrc,
                    importLoaders: 2,
                    localIdentName: '[name]-[local]-[hash:base64:3]',
                    modules: true
                }
            },
            //reason we don't watch scss and css at the same time sass-loader see https://github.com/sass/node-sass/issues/2251
            //SASS loader
            {
                loader: 'sass-loader',
                options: {
                    data: '@import "./src/styles/core";'
                }
            }
        ]
    });

    // We overwrite the default resolve from magento
    config.resolve = {
        alias: {
            parentSrc: path.resolve(parentTheme, 'src'),
            parentComponents: path.resolve(parentTheme, 'src/components'),
            parentQueries: path.resolve(parentTheme, 'src/queries')
        },
        modules: [__dirname, 'node_modules', parentTheme],
        mainFiles: ['index'],
        mainFields: ['esnext', 'es2015', 'browser', 'module', 'main'],
        extensions: ['.wasm', '.mjs', '.js', '.json', '.graphql']
    };

    config.plugins.push(
        new NormalModuleOverridePlugin(componentOverrideMapping)
    );

    return config;
};