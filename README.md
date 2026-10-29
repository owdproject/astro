<div align="center">

  <h1>@owdproject/astro</h1>

  <p>
    <strong>Official Astro Islands & Custom Element Adapter for Open Web Desktop.</strong><br /><br />
    Shared cross-island <code>Desktop</code> singleton and zero-framework<br />
    <code>&lt;owd-desktop-window&gt;</code> Custom Elements powered by <code>@owdproject/core</code>.
  </p>

  <br />

  <p>
    <a href="https://npmjs.com/package/@owdproject/astro"><img src="https://img.shields.io/npm/v/@owdproject/astro/alpha.svg?style=flat&colorA=020420&colorB=00DC82" alt="npm version" /></a>
    <a href="https://astro.build"><img src="https://img.shields.io/badge/Astro-020420?logo=astro" alt="Astro" /></a>
    <a href="https://github.com/owdproject/core/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-00DC82.svg?style=flat&colorA=020420&colorB=00DC82" alt="License" /></a>
  </p>

</div>

---

## Overview

`@owdproject/astro` (`4.0.0-alpha.0`) enables multi-framework Astro Islands (React, Vue, Svelte) on the same page to share a single [`@owdproject/core`](https://npmjs.com/package/@owdproject/core) `Desktop` instance via `getSharedDesktop()`, and provides a native `<owd-desktop-window>` Custom Element with built-in drag and resize handles.

---

## Quick Start

```bash
pnpm add @owdproject/core@4.0.0-alpha.0 @owdproject/astro@4.0.0-alpha.0
```

```ts
import { getSharedDesktop, defineOwdWindowElement } from '@owdproject/astro'

const desktop = getSharedDesktop()
defineOwdWindowElement('owd-desktop-window', desktop)
```

---

## License

[MIT](https://opensource.org/licenses/MIT)
