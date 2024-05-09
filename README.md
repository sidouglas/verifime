# Verifime Muti-currency Invoice

This is a [Next.js](https://nextjs.org/) project bootstrapped using [`create-next-app`](https://github.com/vercel/next.js/tree/HEAD/packages/create-next-app) with Material UI installed.

## Setup

This was initially copied from https://github.com/mui/material-ui/tree/master/examples/material-ui-nextjs-ts

```bash
curl https://codeload.github.com/mui/material-ui/tar.gz/master | tar -xz --strip=2  material-ui-master/examples/material-ui-nextjs-ts
cd material-ui-nextjs-ts
```

- Added nvmrc - required node 21.5
- npm
- Eslint rules that author (Simon) is used to

### Install it and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

### Deployment Url

https://verifime-git-main-sidouglasnets-projects.vercel.app/

### Requirements

https://verifime-git-main-sidouglasnets-projects.vercel.app/verifime-test.pdf

### Notes

Took about a good 1/2 day to get to this stage. Given that the original requirement was <=3 hours:

- Skipped the import/export json feature (time constraints)
  - Therefore multiple invoices are not possible
  - Technically it would be possible as an `<Invoice/>` can receive props
- Rather than a onblur triggering to recalculate totals, I added a calculate button - this must be pushed in order to recalculate the total
  - The button is disabled if the line items are in an invalid state.
