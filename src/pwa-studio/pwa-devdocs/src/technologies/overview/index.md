---
title: Overview
---

This page provides a brief description of a Progressive Web App (PWA) and its relationship to the Magento PWA Studio project.

## What is a Progressive Web App

A Progressive Web App, or PWA, is a web application that uses modern web technologies and design patterns to provide a reliable, fast, and engaging user experience.

The following features define a basic PWA website:

-   **Fast** - PWA sites use a variety of performance optimization strategies to provide a responsive experience or load content fast, even on slow networks.
-   **Secure** - PWA sites use HTTPS connections for enhanced security.
-   **Responsive** - PWA sites implement responsive design strategies to provide a consistent experience on desktops, tablets, and mobile devices. 
-   **Cross-browser compatible** - PWA sites work equally well on all modern browsers, such as Chrome, Edge, Firefox, Safari. 
-   **Offline Mode** - PWA sites cache content to ensure that some content can be served when a user is offline.
-   **Mobile "Install"** - Mobile users can add PWA sites to their home screens and even receive Push notifications from the site.
-   **Shareable content** - Each page in a PWA site has a unique URL that can be shared with other apps or social media.

## What is the Magento PWA Studio project

![pwa studio overview][]

The Magento PWA Studio project is a set of developer tools that allow for the development, deployment, and maintenance of a PWA storefront on top of Magento 2. 
It uses modern [tools and libraries][] to create a build system and framework that adheres to the Magento principle of extensibility.

The Magento PWA Studio project provides the following tools:

-   **[pwa-buildpack][] CLI tools** - Contains the main build and development tools for a Magento PWA.
-   **[Peregrine][] hooks and components** - Contains a collection of useful components and custom React hooks for a Magento PWA.
-   **[Venia][] store and visual components** - The Venia package contains a proof of concept Magento 2 storefront built using the PWA Studio tools.
    It also provides visual components you can use in your own projects.
-   **[UPWARD][]** - A specification for a file that determines the behavior of the application server.
    The project provides [UPWARD-JS][], which is a JavaScript implementation of an UPWARD server.
-   **[pwastudio.io][]** - The project provides documentation to help guide developers towards creating a Magento PWA storefront.
-   **Shared Magento server** - Developers have access to a Magento application running in the Cloud to help jumpstart storefront development.
    This server contains sample data and is maintained by the team to ensure that you are developing on the latest version of Magento.
    This shared instance is open to all PWA Studio developers.

[tools and libraries]: {% link technologies/tools-libraries/index.md %}
[pwa-buildpack]: {% link pwa-buildpack/index.md %}
[peregrine]: {% link peregrine/index.md %}
[venia]: {% link venia-pwa-concept/index.md %}
[upward]: {% link technologies/upward/index.md %}
[upward-js]: {% link technologies/upward/reference-implementation/index.md %}
[pwa studio overview]: {%link technologies/overview/images/pwa-studio-developer-overview.png %}

[pwastudio.io]: https://pwastudio.io
