# ![alt text](https://github.com/BoomerangProject/boomerang-wiki/blob/master/images/logo.png "Boomerang Logo")
This is a new repository that is bootstrapped from [UniversalLoginSDK](https://github.com/EthWorks/UniversalLoginSDK) that will be borrowed from heavily in Boomerang.

### Structure
This repository is organized as a monorepo. 

- [BoomerangSDK](https://github.com/BoomerangProject/boomerang/tree/master/boomerang-sdk) - easy way to communicate with relayer, boomerang smart contracts, and IPFS
- [Boomerang Contracts](https://github.com/BoomerangProject/boomerang/tree/master/boomerang-contracts) - all contracts used for Boomerang
- [Boomerang Example](https://github.com/BoomerangProject/boomerang/tree/master/boomerang-example) - example app, which shows how to use BoomerangSDK
- [UniversalLoginSDK](https://github.com/EthWorks/UniversalLoginSDK/blob/master/universal-login-sdk/README.md) - easy way to communicate with relayer by http protocol
- [Universal Login Contracts](https://github.com/EthWorks/UniversalLoginSDK/tree/master/universal-login-contracts) - all contracts used for the UniversalLoginSDK
- [Universal Login Example](https://github.com/EthWorks/UniversalLoginSDK/blob/master/universal-login-example/README.md) - example app, which shows how to use UniversalLoginSDK
- [Relayer](https://github.com/EthWorks/UniversalLoginSDK/blob/master/universal-login-relayer/README.md) - allows to interact with blockchain

## Contributing

Contributions are always welcome, no matter how large or small. Before contributing, please read the [code of conduct](https://github.com/BoomerangProject/boomerang/tree/master/CODE_OF_CONDUCT.md) and [contribution policy](https://github.com/BoomerangProject/boomerang/tree/master/CONTRIBUTION.md).

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

Boomerang is released under the [MIT License](https://opensource.org/licenses/MIT).
