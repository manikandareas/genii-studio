# Repository Guidelines

## Project Structure & Module Organization
- `schemaTypes/`: Sanity document/type definitions (e.g., `userType.ts`, `courseType.ts`).
- `sanity.config.ts`, `sanity.types.ts`, `schema.json`: Studio config and generated types/schema.
- `functions/sync-embedding/`: Sanity Function indexing content to Upstash Vector.
- `scripts/`: Helpers to sync `sanity.types.ts` and `schema.json` to frontend repos.
- `static/`: Static assets for the Studio. `dist/`: build output. `docs/`: project docs.

## Build, Test, and Development Commands
- `npm run dev`: Start Sanity Studio locally (http://localhost:3333).
- `npm start`: Alias of `sanity start` for local dev.
- `npm run build`: Production build to `dist/`.
- `npm run deploy`: Deploy Studio via Sanity hosting.
- `npm run deploy-graphql`: Deploy the Sanity GraphQL API.
- `npm run typegen`: Extract schema and regenerate `sanity.types.ts` + `schema.json`.

## Coding Style & Naming Conventions
- Language: TypeScript. Indent 2 spaces, single quotes, no semicolons, print width 100 (Prettier in `package.json`).
- Linting: ESLint with `@sanity/eslint-config-studio` (`eslint.config.mjs`).
- Files: schema files as `*Type.ts` (e.g., `quizType.ts`), export with `defineType(...)`.
- Names: camelCase for fields, snake_case for enum values, PascalCase for components.

## Testing Guidelines
- No unit test framework configured. Rely on TypeScript + Studio build checks.
- Before PR: run `npm run typegen` and `npm run build` to validate schemas/types.
- If introducing tests, prefer Vitest; name `*.test.ts` colocated with sources.

## Commit & Pull Request Guidelines
- Use Conventional Commits seen in history: `feat:`, `fix:`, `refactor:`, etc.
  - Example: `feat: add quiz attempt schema with scoring`.
- PRs must include: clear summary, linked issues, and screenshots/GIFs for Studio UI/schema changes.
- Verify locally: `npm run typegen`, `npx prettier --check .`, `npx eslint . --ext .ts,.tsx`, `npm run build`.

## Security & Configuration Tips
- `.env` is required but not committed. For functions: `UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN`. Add Sanity project/dataset tokens as needed.
- Never log secrets; Sanity Functions read via `process.env`.
- Use Node 18+ and `npm ci` for reproducible installs.

