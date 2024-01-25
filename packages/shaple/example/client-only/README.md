# Shaple Auth example

## Setup
### Download shaple CLI
See [shaple-cli](https://github.com/paust-team/shaple-builder/releases/latest)

### Create Project
```bash
shaple project create --project.name [project name]
```
`Project` refers to a unit that divides repositories or services in Shaple.

### Add Stack
```bash
shaple stack add -i [project id] --stack.name [stack name] --stack.siteURL [site url]
```
`Stack` is a unit divided within a `Project` and can be used in conjunction with branches. Alternatively, it is recommended to use it with something like `NODE_ENV`.

### Add Service
You can enable/disable each service individually.

#### Auth
- enable
    ```bash
    shaple stack auth enable -i [stack id]
    ```
- disable
    ```bash
    shaple stack auth disable -i [stack id]
    ```

### Configure
You can save this series of steps in a file named [shaple.toml](shaple.toml) for future use. Then, it can be utilized with `shaple stack auth enable (or disable)`.

## Run
```bash
yarn dev
```