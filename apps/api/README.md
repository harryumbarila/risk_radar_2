## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

### Create new module - feature

```
cd apps/api
nest g mo YOUR_MODULE_FEATURE
```

### Launch Swagger documentation

```
# watch mode
$ yarn run dev
```

```
http://localhost:3001/api/swagger
```
