![alt text](https://github.com/BoomerangProject/boomerang-wiki/blob/master/images/logo.png "Boomerang Logo")
# Boomerang
This is a new repository that is bootstrapped from [UniversalLoginSDK](https://github.com/EthWorks/UniversalLoginSDK) that will be borrowed from heavily in Boomerang.

### Structure
This repository is organized as monorepo. 

- [Boomerang Contracts](https://github.com/BoomerangProject/boomerang/tree/master/boomerang-contracts) - all contracts used for Boomerang
- [BoomerangSDK](https://github.com/BoomerangProject/boomerang/tree/master/boomerang-contracts) - easy way to communicate with relayer, boomerang smart contracts, and IPFS
- [UniversalLoginSDK](https://github.com/EthWorks/UniversalLoginSDK/blob/master/universal-login-sdk/README.md) - easy way to communicate with relayer by http protocol
- [Universal Login Contracts](https://github.com/EthWorks/UniversalLoginSDK/tree/master/universal-login-contracts) - all contracts used for the UniversalLoginSDK
- [Universal Login Example](https://github.com/EthWorks/UniversalLoginSDK/blob/master/universal-login-example/README.md) - example app, which shows how to use UniversalLoginSDK
- [Relayer](https://github.com/EthWorks/UniversalLoginSDK/blob/master/universal-login-relayer/README.md) - allows to interact with blockchain


[![Build Status](https://travis-ci.com/EthWorks/UniversalLoginSDK.svg?branch=master)](https://travis-ci.com/EthWorks/UniversalLoginSDK)

## Ethereum Identity SDK

Ethereum Identity SDK is composed of smart contracts, a js lib, and a relayer that help build applications using ERC [#725](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-725.md), [#735](https://github.com/ethereum/EIPs/issues/735), [#1077](https://github.com/ethereum/EIPs/pull/1077) and [#1078](https://github.com/ethereum/EIPs/pull/1078).

This is a work in progress. Expect breaking changes. The code has not been audited and therefore can not be considered secure.
Planned functionality for first release include:

- Creating and managing identities
- Multi-factor authentication
- Universal login
- Ether less transactions via relayer

### Structure
This repository is organised as monorepo. 

- [Contracts](https://github.com/EthWorks/UniversalLoginSDK/tree/master/universal-login-contracts) - all contracts used in this project
- [Example](https://github.com/EthWorks/UniversalLoginSDK/blob/master/universal-login-example/README.md) - example app, which shows how to use SDK
- [Relayer](https://github.com/EthWorks/UniversalLoginSDK/blob/master/universal-login-relayer/README.md) - allows to interact with blockchain
- [SDK](https://github.com/EthWorks/UniversalLoginSDK/blob/master/universal-login-sdk/README.md) - easy way to communicate with relayer by http protocol


## Quick example start 

To install dependencies and build projects run following commands from the main project directory:

```sh
yarn && yarn build
```

To run example:

```sh
cd universal-login-example
yarn dev:start
```
[manual option](https://github.com/EthWorks/UniversalLoginSDK/blob/master/universal-login-example/README.md)



## Contributing

Contributions are always welcome, no matter how large or small. Before contributing, please read the [code of conduct](https://github.com/EthWorks/UniversalLoginSDK/blob/master/CODE_OF_CONDUCT.md) and [contribution policy](https://github.com/EthWorks/UniversalLoginSDK/blob/master/CONTRIBUTION.md).

Before you issue pull request:
* Make sure all tests and linters pass.
* Make sure you have test coverage for any new features.


## Running linting/tests

You can run lint via:

```sh
./script/lint.sh
```

You can run tests:

```sh
./scripts/test.sh
```

You can ran full clean:
```sh
./scripts/clean.sh
```

And you can emulate full CI process by:
```sh
yarn
./scripts/travis.sh
```

## License

Universal Login SDK is released under the [MIT License](https://opensource.org/licenses/MIT).
