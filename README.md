# Trustly React Native Example

> [!WARNING]  
> Work in progress, not yet complete and unreleased.

Note: The SDK package will be published in an NPM repository later. For now, please manually clone the [SDK git repository](https://github.com/TrustlyInc/trustly-react-native/) using the same root as this application. Example:

```
.
├── trustly-react-native
└── trustly-react-native-example
```

## Getting Started

### Requirements

- **Node** 20

### Setup

- Open the `env.js` file and fill out your environment variables.
- (Optional) Edit the payload information in the `EstablishData.tsx` file.

### SDK Installation and Update

Clean previous builds (if any)

```shell
rm -rfv node_modules
```

After that install all the dependencies:

```shell
npm install
```

### Running

```shell
npm run start
```

## Contributing

### Setup

We recommend the [**Visual Studio Code**](https://code.visualstudio.com/) as the code editor. There are some [settings](.vscode/settings.json) for it versioned in this repository, but, please, also install its recommended [extensions](.vscode/extensions.json).