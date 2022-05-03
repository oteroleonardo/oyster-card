export default {
  timeout: '60s',
  files: ['src/**/__tests__/*.ts'],
  environmentVariables: {
    NODE_ENV: 'test'
  },
  nodeArguments: [],
  require: ['ts-node/register/transpile-only', 'tsconfig-paths/register'],
  extensions: ['ts'],
  failFast: false,
  verbose: true
};
