# Contributing to bdkit

ধন্যবাদ! Thank you for helping. You can write issues and PRs in বাংলা or English.

## Getting started

```bash
git clone https://github.com/<your-username>/bdkit.git
cd bdkit
npm install
npm test
```

Node.js 18 or newer is required. `npm test` builds the library and runs all tests.

## Making a change

1. Pick an issue (look for `good first issue`) and comment that you're working on it.
2. Create a branch: `git checkout -b fix-some-thing`.
3. Make your change in `src/` and **add tests** in `test/`.
4. Run `npm test` — everything must pass.
5. Open a pull request describing what you changed and why.

## Guidelines

- **Zero runtime dependencies.** Keep the library tiny.
- **Correctness first.** For Bangla words, spellings and calendar rules, please cite a source
  (Bangla Academy, government site, etc.) in the PR if it's not obvious.
- Keep functions small and fully typed; export new public functions from `src/index.ts`.
- Update `README.md` when you add a public function.

## First time contributing to open source?

That's great — this project is meant to be friendly for first PRs. If you get stuck,
open a draft PR or ask in the issue. কোনো প্রশ্নই বোকা প্রশ্ন না।

Please be kind and respectful to everyone; see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
