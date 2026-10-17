# @ostro/foundation — Antigravity AI Architecture & Knowledge Base

> **Package Name**: `@ostro/foundation`
> **Version**: `2.0.0-alpha.1`
> **Role in Ecosystem**: Modular Core Framework Library

---

## 1. Package Purpose & Overview
Ostro core bootstrap lifecycle, application bootstrapper, service provider registration, and error handling orchestration.

- **Primary Architectural Patterns**: Kernel middleware pipeline, lifecycle hooks (booting, booted), provider registration.
- **Key Exported Entities**: `Application`, `HttpKernel`, `ConsoleKernel`, `ExceptionHandler`, `ServiceProvider`

---

## 2. Dependencies & Interoperability
- **Direct Dependencies**:
  - `@ostro/auth`: `^1.0.1`
  - `@ostro/config`: `^1.0.2`
  - `@ostro/console`: `^1.0.6`
  - `@ostro/container`: `^1.0.3`
  - `@ostro/contracts`: `^1.1.4`
  - `@ostro/filesystem`: `^1.0.3`
  - `@ostro/http`: `^1.0.9`
  - `@ostro/logger`: `^1.0.0`
  - `@ostro/server`: `^1.3.10`
  - `@ostro/support`: `^1.2.1`
  - `csrf`: `3.1.0`
  - `dotenv`: `10.0.0`
  - `fs-extra`: `^10.0.0`
  - `lodash.get`: `^4.4.2`
  - `ouch`: `^2.0.0`
  - `path-to-regexp`: `^8.4.2`
  - `serve-static`: `1.14.1`
- **Framework Consumers**: Consumed across the OstroJS ecosystem via `@ostro/framework` and direct imports.

---

## 3. Directory & Source Layout
```text
origin/foundation/
├── aliasLoader.ts
├── application.ts
├── auth/access/authorizable.ts
├── auth/guardResolver.ts
├── auth/user.ts
├── bootstrap/bootProviders.ts
├── bootstrap/handleSystemError.ts
├── bootstrap/loadConfiguration.ts
├── bootstrap/loadEnvironmentVariables.ts
├── bootstrap/registerFacades.ts
├── bootstrap/registerProviders.ts
├── bootstrap/requestBound.ts
├── bootstrap/responseBound.ts
├── console/consoleMakeCommand.ts
├── console/eventGenerateCommand.ts
├── console/eventMakeCommand.ts
├── console/kernel.ts
├── console/keyGenerateCommand.ts
├── console/modelMakeCommand.ts
├── console/resourceMakeCommand.ts
└── ... (28 more files)
```

---

## 4. TypeScript Typing & Code Standards
1. **Access Modifiers**: All class properties and methods declare explicit visibility (`public`, `protected`, `private`).
2. **Inheritance & Overrides**: Classes overriding base class methods use the `override` keyword to safeguard contracts.
3. **Immutability**: Constant lookup tables and static registries use `readonly` and strict record types.
4. **No Implicit Any**: Public APIs avoid `any` in favor of generics (`<T = unknown>`) and typed contracts from `@ostro/contracts`.
5. **Contract Binding**: Core managers implement contracts from `@ostro/contracts/foundation/*`.

---

## 5. Development & Verification Guide
- **Compile / Build**: `npm run build` (runs `rm -rf build && npx tsc -p tsconfig.build.json`)
- **Run Tests**: `npm test` (executes Jest with 100% coverage target via `c8`)
- **Published Artifacts**: Target output compiled to `./build` with accompanying `.d.ts` declarations and source maps.

---
*Generated for Antigravity AI high-speed codebase comprehension with minimal token consumption.*
