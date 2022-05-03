# Oyster Card Problem

## Table of Contents

- [Oyster Card Problem](#oyster-card-problem)
  - [Table of Contents](#table-of-contents)
  - [Oyster Card Project](#oyster-card-project)
  - [Before run the code](#before-run-the-code)
  - [How to run the code](#how-to-run-the-code)
  - [Directory Structure](#directory-structure)
  - [Development Best Practices](#development-best-practices)
  - [Node Scripts](#node-scripts)

## Oyster Card Project

The intention of this project is to solve the Oyster card problem technical test.


## Before run the code

Before run the code you first need to have installed Node.js@14.18.1 and yarn@1.22.x (or > version).
Then once you download/clone code project you just need to install project's dependencies by executing:

  ```bash
  cd [PROJECT_PATH]/
  yarn install
  ```

## How to run the code

This Project was created using TDD and AVA testing module. To run tests simple execute:

  ```bash
  yarn run test:ava
  ```

## Directory Structure

```coffee
.
├── scripts
│   └── ...                         # CI/CD and other utility scripts
├── src
│   ├── constants                   # Constants used throughout the project
│   ├── core                        # Classes related to core business logic
│   ├── interfaces                  # Interfaces for describing objects
│   ├── types                       # Types definitions
├── .gitignore                      # Tells git which files to ignore
├── package.json                    # Package configuration. The list of 3rd party libraries and utilities
├── ava.config.unit.js              # AVA configuration file for unit tests
├── README.md                       # Main project readme
├── tsconfig.json                   # TypeScript configuration
├── tslint.json                     # TypeScript Lint configuration
└── yarn.lock
```

## Development Best Practices

See the documentation [here](./docs/dev-best-practices.md)

---

## Node Scripts

Unfortunately, scripts in package.json can't be commented inline because the JSON spec doesn't support comments, info on what each script in package.json is listed below.

| **Script**        | **Description**                                                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| codecov           | Runs the codecov tool against the test code                                                                                                                |
| lint              | Runs ESLint on build related JS files. (eslint-loader lints src files via webpack when `yarn start` is run)                                                |
| lint:fix          | Runs ESLint on build related JS files but auto-fixes issues that can be auto-fixed. (eslint-loader lints src files via webpack when `yarn start` is run)   |
| test:ava          | Runs tests (files under __test__ folders) using AVA and outputs results to the command line. Watches all files so tests are re-run upon save.     |
