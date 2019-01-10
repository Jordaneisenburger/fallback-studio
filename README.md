# Fallback Studio

Fallback Studio creates a wrapper around [PWA Studio](https://github.com/magento-research/pwa-studio) and provides a
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

- NodeJS >=10.14.1 LTS

- Node Package Manager

- unix based OS for example MacOS or Linux

## Quick setup 


**step: 1**
```
git clone https://github.com/Jordaneisenburger/fallback-studio.git
```

**step: 2**
```
cd fallback-studio
```

**step: 2** (this runs all necessary package.json commands back to back)
```
npm run setup
```

**step: 3**
```
npm run watch:example-shop
```

Right now you should see something like this in your terminal:

![Alt text](docs/quick-setup.png?raw=true "Quick setup")

## How the fallback structure works



```

```

## Creating a custom storefront



```

```

## Updating PWA Studio



```

```


## License



## Credits

* Magento for creating [PWA Studio](https://github.com/magento-research/pwa-studio)

