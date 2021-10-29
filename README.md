# 🤖 CI Tools

This project is a collection of Command Line Interface (CLI) tools for Continuous Integration (CI) environments powered by [Node.js].

## 🛠 Installation

Execute the following command in linux shell:
```shell
curl -sL $TODO_URL | bash
```

## ⚡ Usage

### ⏫ Bump version code
```shell
ci-tools bump_version_code \
  --gradle_file=app/build.gradle \
  --service_account=service_account.json \
  --project_number=1234567890 \
  --app_id=1:1234567890:android:01234567890abcdef
```

## 🧑‍💻 Development info

This Node.js project is configured to use [Typescript], which brings compile-time type-safety.

Furthermore, this project uses [yarn] for package management.

Finally, [pkg] is used to bundle the project into a single self-contained executable binary. The [Typescript] transpilation module format is set to CommonJS since the [pkg] bundler does not fully support ESM yet.

### ⚙ Prerequisites
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
