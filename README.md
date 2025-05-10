# Ease for ROS2.XYZ

A versatile [Ghost](https://github.com/TryGhost/Ghost) theme suitable for documentation. Publish your posts or business information with ease.

**Demo: https://ros2.xyz**

# Features

The following additional features are added to the original [Ease](https://github.com/TryGhost/Ease) theme:

- Table of contents
- Markdown callout boxes
- Mermaid diagrams (mermaid.js)
- Latex equations (katex.js)
- Code block with line numbers and syntax highlighting (highlight.js)
- Side-by-side images with captions
- Customized table styles and other adjustments for technical contents

You can refer to the [SAMPLE.md](SAMPLE.md) file for the usage of these features.

# Instructions

1. [Download this theme](https://github.com/TryGhost/Ease/archive/main.zip)
2. Log into Ghost, and go to the `Design` settings area to upload the zip file

# Development

Styles are compiled using Gulp/PostCSS to polyfill future CSS spec. You'll need [Node](https://nodejs.org/), [Yarn](https://yarnpkg.com/) and [Gulp](https://gulpjs.com) installed globally. After that, from the theme's root directory:

```bash
# Install
yarn

# Run build & watch for changes
yarn dev
```

Now you can edit `/assets/css/` files, which will be compiled to `/assets/built/` automatically.

The `zip` Gulp task packages the theme files into `dist/ease.zip`, which you can then upload to your site.

```bash
yarn zip
```

# Ghost Setup

You need to install ghost to preview the theme locally.

First-time setup:

```bash
# install node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 22
node -v 

# install npm
sudo apt install npm

# install ghost
npm install ghost-cli@latest -g
```

Create a new ghost instance:

```bash
cd <your-ghost-ws>
ghost install local
```

Once the install is finished you'll be able to access your new site on `http://localhost:2368` and `http://localhost:2368/ghost` to access Ghost Admin.

| Command         | Description                                 |
| --------------- | ------------------------------------------- |
| `ghost start`   | Start Ghost as a background service         |
| `ghost stop`    | Stop the Ghost instance                     |
| `ghost restart` | Restart it (e.g. after theme change)        |
| `ghost log`     | View Ghost server logs                      |
| `ghost run`     | Run Ghost in foreground (for dev debugging) |
| `ghost status`  | Show current Ghost status (running or not)  |

You need to link the theme to the ghost instance:

```bash
ln -sf $(pwd) <your-ghost-ws>/content/themes/ease
ghost restart
```

# Contribution

This repo is synced automatically with [TryGhost/Themes](https://github.com/TryGhost/Themes) monorepo. If you're looking to contribute or raise an issue, head over to the main repository [TryGhost/Themes](https://github.com/TryGhost/Themes) where our official themes are developed.

# Copyright & License

Copyright (c) 2013-2025 Ghost Foundation - Released under the [MIT license](LICENSE).
