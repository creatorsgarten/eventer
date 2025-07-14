# Eventer

Eventer (temporary name) is a collection of versatile event management tools made for Thai event organizers.

![Eventer Logo](./assets/images/eventer-cover.png)

## Tasks

### Set up

- [x] Set up Database
- [x] Set up Biome
- [x] Set up lint-staged
- [x] Set up vitest
- [x] Set up CI/CD
- [ ] Set up playwright

## Development

### Code Quality

This project uses [Biome](https://biomejs.dev/) for linting and formatting, with [lint-staged](https://github.com/lint-staged/lint-staged) to ensure code quality on commits.

- **Linting & Formatting**: `bun run lint` - Check code style and format
- **Lint Staged Files**: `bun run lint-staged` - Run linting/formatting on staged files only

The pre-commit hook automatically runs lint-staged to format and lint only the files you've staged for commit, ensuring consistent code quality without slowing down your workflow.
