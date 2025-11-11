# Technical Context: Splainer Search

## Technologies Used
- **Primary Language**: JavaScript (ESM modules)
- **Testing Framework**: Vitest (Jest-compatible)
- **Build System**: tsup (for ESM and CJS builds)
- **Code Quality**: ESLint with TypeScript configuration, Prettier for formatting
- **Package Management**: pnpm (for faster, more reliable dependency management)
- **Documentation**: JSDoc for type documentation
- **Version Control**: Git (with GitHub repository)

## Development Setup
- Node.js version 18+ recommended
- pnpm package manager
- Development environment configured with:
  - ESLint for code linting
  - Prettier for code formatting
  - Vitest for testing
  - tsup for building

## Technical Constraints
- Must maintain backward compatibility with existing AngularJS consumers
- Support both modern browsers and Node.js environments
- Preserve the same public API surface for compatibility
- Handle cross-origin restrictions appropriately (JSONP for Solr, CORS for ES)
- Support both synchronous and asynchronous operations where needed

## Dependencies
The project will need the following key dependencies:
- **tsup**: For building ESM and CJS modules
- **vitest**: For testing
- **eslint**: For code linting
- **prettier**: For code formatting
- **@types/node**: For Node.js type definitions
- **@types/jest**: For Jest-compatible testing types

## Tool Usage Patterns
- Use pnpm for package management (faster than npm)
- Run tests with `pnpm test` command
- Build with `pnpm build` command
- Lint with `pnpm lint` command
- Format code with `pnpm format` command
- Use TypeScript configuration for better IDE support

## Architecture Decisions
- Choose ESM as the primary module format for modern browser support
- Use tsup for build configuration to generate both ESM and CJS outputs
- Implement comprehensive test coverage with Vitest
- Maintain the existing AngularJS API for backward compatibility
- Follow existing code patterns and conventions from the AngularJS version

## Testing Strategy
- Unit tests for individual components
- Integration tests for end-to-end functionality
- Test coverage for all public APIs
- Mock external dependencies where appropriate
- Test both success and error scenarios
