const { configureWebpack } = require('@magento/pwa-buildpack');
const NormalModuleOverridePlugin = require('./normalModuleOverrideWebpackPlugin');
const componentOverrideMapping = require('./componentOverrideMapping');

const path = require('path');

const parentTheme = path.resolve(
    __dirname + '/../../pwa-studio/packages/venia-concept'
);

const parentThemeSrc = path.resolve(
    __dirname + '/../../pwa-studio/packages/venia-concept/src'
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
            '@magento/peregrine': {
                esModules: true
            },
            '@magento/venia-concept': {
                rootComponents: true
            }

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

    //test: /\.graphql$/
    config.module.rules[0].include.push(parentThemeSrc);
    // test: /\.(mjs|js)$/
    config.module.rules[1].include.push(parentThemeSrc);
    //test: /\.css$/
    config.module.rules[2].oneOf[0].test.push(parentThemeSrc);

    // We overwrite the default resolve from magento
    config.resolve = {
        alias: {
            parentSrc: parentThemeSrc,
            parentComponents: path.resolve(parentThemeSrc, 'components'),
            parentQueries: path.resolve(parentThemeSrc, 'queries')
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
