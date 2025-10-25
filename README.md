<h1 align="center">
<img alt="logo" src="./assets/icon.png" width="124px" style="border-radius:10px"/><br/>
Unnamed App </h1>

> This Project is based on [Obytes starter](https://starter.obytes.com)

## Prerequiste

- [Expo dev environment](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&platform=android&device=simulated&buildEnv=local)
- [Node.js LTS release](https://nodejs.org/en/)
- [Pnpm](https://pnpm.io/installation)

## Env variables (wip)

## Run the app

Clone the repo to your machine and install deps :

```sh
pnpm install
```

To run the app on ios

```sh
pnpm ios
```

To run the app on android

```sh
pnpm android
```

## Common Commands for Deguging

make sure running react-native 0.81.X

```
pnpm ls react-native
```

run a fresh build (general)

```
rm -rf node_modules
pnpm expo prebuild --clean
```

run a fresh build (android)

```
rm -rf android/.gradle android/app/.cxx android/app/build
cd android && ./gradlew clean && cd ..
```

run a fresh build (ios)

```
rm -rf Podfile.lock
```

Run on real device (android)

- connect device using usb
- settings > developer settings > enable usb debugging
- `pnpm android --device` select your device

## Contribution Guide

### PR Title

Make sure to inclue the relevent linear issue(s) in the PR Title. example - `[CAP-50] User Login`

### Branch Name

Branch Name should be of the form `name/title`.example - `ankush/user-login`

### Commit Messages

- `fix:` - for bug fixes
- `feat:` - for new features
- `perf:` - for performance improvements
- `docs:` - for documentation changes
- `style:` - for formatting changes
- `refactor:` - for code refactoring
- `test:`- for adding missing tests
- `chore:` - for maintenance tasks
  Use lowercase for commit messages. example - `feat: add login`

## ✍️ Documentation

- [Rules and Conventions](https://starter.obytes.com/getting-started/rules-and-conventions/)
- [Project structure](https://starter.obytes.com/getting-started/project-structure)
- [Environment vars and config](https://starter.obytes.com/getting-started/environment-vars-config)
- [UI and Theming](https://starter.obytes.com/ui-and-theme/ui-theming)
- [Components](https://starter.obytes.com/ui-and-theme/components)
- [Forms](https://starter.obytes.com/ui-and-theme/Forms)
- [Data fetching](https://starter.obytes.com/guides/data-fetching)
- [Contribute to starter](https://starter.obytes.com/how-to-contribute/)

## 📄 License

MIT © 2025
