[![node][node]][node-url] [![pwa-studio][pwa-studio]][pwa-studio-url]

[node]: https://img.shields.io/badge/Node-%3E%3D10.14.1-brightgreen.svg
[node-url]: https://nodejs.org

[pwa-studio]: https://img.shields.io/badge/pwa--studio-v4.0.0-brightgreen.svg
[pwa-studio-url]: https://github.com/magento-research/pwa-studio

# README is partially outdated will be updated soon!

# Fallback Studio


Fallback Studio (<small>the name was too funny not to use</small>) creates a wrapper around [PWA Studio](https://github.com/magento-research/pwa-studio) and provides a
basic fallback structure so you can create storefronts that depend on the venia-concept storefront. 

### Motivation

The reason i created this repository is because the first time i cloned `pwa-studio` 
and followed the docs i had no clue on how or where to start building my own storefront.

The idea behind this fallback structure is basically the same as we know it from default Magento. 
Your custom storefront will be the same as `venia-concept` except the components that you've changed 
to your needs or custom made. When you've been developing follow this approach for a while you will find that in-time hardly 
anything will fallback to `venia-concept` thus making your storefront stand on it's own.

I assume that for a lot of frontend Magento developers PWA and all the techniques used to create one are somewhat uncharted waters.
With this setup i hope to remove the "i have no clue where to start" feeling and make it simple for developers to start playing with `pwa-studio`

Based on the amount questions i've been asked and seen in the community around this topic i decided to make this public.

## Prerequisites
Make sure you have the following:

- NodeJS >= 10.14.1 LTS (NodeJS 11+ can cause problems)

- Yarn >= 1.13.0

- Python 2.7 and build tools, [see the Installation instructions on node-gyp](https://github.com/nodejs/node-gyp#installation) for your platform.

- unix based OS for example MacOS or Linux

## Quick setup

Note: only run commands from the root dir

**step: 1**
```
git clone https://github.com/Jordaneisenburger/fallback-studio.git
```

**step: 2**
```
cd fallback-studio
```

**step: 3** (this runs all necessary package.json commands back to back)
```
yarn run setup
```

**step: 4**
```
yarn run watch:example-shop
```

Right now you should see something like this in your terminal:

![Alt text](docs/quick-setup.png?raw=true "Quick setup")

## How the fallback structure works

So to give you a feeling on how it all works we first need to take a look at a crucial file in the fallback structure.
If you open the following file `src/example-company/example-shop/webpack.config.js` you see it looks a lot like the default `webpack.config.json` from
`venia-concept`. The big difference is that everywhere there is a path to a certain file or folder we removed the contents from our storefront and added a fallback path.

**For example:**<br />
in our storefront we don't want to create a custom `validate-environment.js` because the default from `venia-concept` fits our needs so we've deleted it from the `example-shop` storefront.

Now to fallback to `venia-concept` we've changed **this:**
```
const validEnv = require('./validate-environment')(process.env);
```
**to this:**
```
//declared at the top of our webpack.config.js
const parentTheme = path.resolve(process.cwd() + '/../../pwa-studio/packages/venia-concept');

const validEnv = require(`${parentTheme}/validate-environment`)(process.env);
```
As you can tell this is pretty basic and straightforward. 
<br/><br/>

### So how about React components?

To do this we again need to take a look at our `webpack.config.js` file but this time we need to scroll down a bit till we get to the `resolve` part that looks like:

```
resolve: {
    modules: [__dirname, 'node_modules', parentTheme],
    mainFiles: ['index'],
    extensions: ['.mjs', '.js', '.json', '.graphql'],
    alias: {
        parentSrc: path.resolve(parentTheme, 'src'),
        parentComponents: path.resolve(parentTheme, 'src/components'),
        parentQueries: path.resolve(parentTheme, 'src/queries')
    }

}
```
As you can see we once again included the `const parentTheme` in the modules array. But the real 'magic' happens in the `alias` part.
3 aliases are added for different folders inside the `venia-concept` folder. 

**For example:**<br />
`parentComponents` will resolve to `pwa-studio/packages/venia-concept/src/components`

I've created a really basic example on how to fallback on `venia-concept` components. But first I'd like you to navigate to `src/example-company/example-shop/src/components` as you can tell we are missing quite a few components.<br />

 Now pleas run the follow command from the root directory `yarn run watch:example-shop` as you can tell it's pretty much the same as `venia-concept` but we've added a custom `TopBar` component
 and overwritten the `Footer` component and added and extra block of content.
 
 **Lets take a look at the code:**<br />
 Look at the following folder `src/example-company/example-shop/src/components/Footer` as you can tell we've only copied `index.js` and `footer.js` but we are missing `footer.css` but the styling still works.
 That's because inside `footer.js` we made a little change:
 
 **from this:**
 ```
 import defaultClasses from './footer.css';
 ```
 
 **to this:** (remember our alias inside webpack.config.js?)
 ```
 import defaultClasses from 'parentComponents/Footer/footer.css';
 ```
 So we've changed this component with a custom piece of content 'Custom Example shop' but kept the default styling.
 
 **Another example:**<br/>
 I've created a custom component called `TopBar` this one is not overwritten from `venia-concept` storefront. I want to include this on every page so I've copied the `Main` component from `venia-concept` to our `components` folder.
 
 As you can tell I've added aliases for all components that we are not changing and included my own custom component:
 ```
 //Uncomment to use venia-concept footer again
 //import Footer from 'parentComponents/Footer';
 
 import Footer from 'src/components/Footer';
 
 import Header from 'parentComponents/Header';
 import TopBar from 'src/components/TopBar';
 import defaultClasses from 'parentComponents/Main/main.css';
 
 ...
 
 <main className={classes.root}>
     <TopBar />
     <Header />
     <article className={classes.page}>{children}</article>
     <Footer />
 </main>
 ```
  
## Creating a custom storefront
The easiest way to add a custom storefront is to duplicate the `example-company` folder and rename it to your likings.
Don't forget to change it inside the root package.json, lerna.json and the package.json from the storefront.

**NOTE:**<br />
For now you shouldn't change the names of the folder because there will be bugfixes etc. and if you've changed the folder names this will cause problems when you update this repo. I'm planning on adding a simple CLI like `create-react-app` to setup your own theme.


## Updating PWA Studio
To update to the latest `pwa-studio` version you want to run the following commands from the project root dir

```
yarn run upgrade:pwa-studio
```

**NOTE:**<br/>
Always check the changes before you update because you might need to make changes to your custom storefront to prevent issues.


## TODO

- add simple CLI for creating storefronts
- get the complete dev experience by working with the watch:all script


## Credits

* Magento for creating [PWA Studio](https://github.com/magento-research/pwa-studio)

## Definitely not needed but appreciated

<a href="https://www.buymeacoffee.com/Fc5IDf687" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
