# 🤖 CI Tools

[![Build & Release](https://github.com/inkldev/ci-tools/actions/workflows/build-release.yaml/badge.svg)](https://github.com/inkldev/ci-tools/actions/workflows/build-release.yaml)

This project is a collection of Command Line Interface (CLI) tools for Continuous Integration (CI) environments powered by [Node.js].

## 🛠 Installation

The CI tools are distributed as a single binary files that is installed by a shell script via the following command:
```shell
curl -sL https://raw.githubusercontent.com/inkldev/ci-tools/main/install.sh | bash
```

Upon successful installation you should see:
```
✅ ci-tools vX.Y.Z is now installed
🎉 All Done!
```
By default, the shell script will download the latest version of `ci-tools`. You can specify a release version via the `CI_TOOLS_VERSION` environment variable:
```shell
export CI_TOOLS_VERSION=X.Y.Z
```

## ⚡ Usage

### ⏫ Bump version code

Fetches the version code of the latest Android app release, increments it by 1 and saves it in the given `build.gradle` file.

```shell
ci-tools bump_version_code \
  --gradle_file=app/build.gradle \
  --service_account=service_account.json \
  --project_number=1234567890 \
  --app_id=1:1234567890:android:01234567890abcdef
```

### 📲 Invite testers to release

Invites testers in the given group(s) to the latest Android app release as determined by version code.

```shell
ci-tools bump_version_code \
  --gradle_file=app/build.gradle \
  --service_account=service_account.json \
  --project_number=1234567890 \
  --app_id=1:1234567890:android:01234567890abcdef
```

## 🧑‍💻 Development

This [Node.js] project is configured to use [Typescript], which brings compile-time type-safety.

Furthermore, this project uses [yarn] for package management.

Finally, [pkg] is used to bundle the project into a single self-contained executable binary. The [Typescript] transpilation module format is set to CommonJS since the [pkg] bundler does not fully support ESM yet.

### ⚙ Requirements
- [x] [Node.js] v16
- [x] [yarn] v1

### 📃 Scripts

- To download all required dependencies, simply run
  ```shell
  yarn install
  ```

- During development of this project, it is useful to enable automatic [Typescript] compilation on source changes, which can be done via the following command
  ```shell
  yarn run dev
  ```

- To execute the project, simply run
  ```shell
  yarn run main --help
  ```

- To generate a build optimized for production, execute
  ```shell
  yarn run build
  ```
  which will emit the executable at `bin/ci-tools`

[Node.js]: https://nodejs.org
[Typescript]: https://www.typescriptlang.org/
[yarn]: https://yarnpkg.com/
[pkg]: https://github.com/vercel/pkg#readme
