# Candle Order App

A monday.com board view app for a luxury candle company. It replaces a manual paper-based order process with a digital UI embedded inside a monday.com Production Orders board.

Built on top of the [monday.com React Quickstart](https://github.com/mondaycom/welcome-apps/tree/master/apps/quickstart-react) template.

## Features

- **Order Maker** - Candle designers select exactly 3 fragrances and a quantity to place a production order directly on the board
- **Fragrance Manager** - Passcode-protected CRUD interface for managing the fragrance catalog (add, edit, delete fragrances)
- **Board Sync** - Fragrance changes automatically update the board's dropdown column labels via the monday.com API

## Architecture

The app is split into two independently deployed packages:

- **`client/`** - Vite + React app that runs inside a monday.com iframe (board view). Uses `monday-sdk-js` for board context and writes, and `@vibe/core` for monday-native UI components.
- **`server/`** - Express + TypeScript API deployed to monday-code. Manages the fragrance catalog via the `@mondaycom/apps-sdk` Storage API and syncs changes to board column definitions.

## Prerequisites

- Node.js
- `@mondaycom/apps-cli` installed globally: `npm install -g @mondaycom/apps-cli`
- Authenticated with monday: `mapps init -t <YOUR_MONDAY_API_TOKEN>`
- An app created in the [monday.com Developer Center](https://developer.monday.com/apps/docs/the-developer-center) with a Board View feature

## Local Development

### Server

```bash
cd server
npm install
npm run dev
# runs on http://localhost:3000
```

### Client

```bash
cd client
npm install
npm run start
# runs on http://localhost:8301 and creates a tunnel 
```

Then paste the tunnel URL into your app's Board View feature settings in the Developer Center.

### Environment Variables

**Client** (`client/.env.development`):
```
VITE_API_URL=http://localhost:3000
```

**Server** (set via `mapps code:env`):
```
MONDAY_API_TOKEN=<your token>
PORT=3000
```

## Testing

```bash
cd client
npm test
```

Tests use Vitest and React Testing Library. Run `npx vitest run` for a single pass or `npx vitest` for watch mode.

## Deployment

Get your App Version ID:

```bash
mapps app-version:list -i <APP_ID>
```

### Deploy the server

```bash
cd server
mapps code:push -i <APP_VERSION_ID>
```

### Deploy the client

```bash
cd client
npm run deploy
```

After deploying the client, update the Board View feature URL in the Developer Center to point to the deployed client URL.

## Links

- [monday.com React Quickstart](https://github.com/mondaycom/welcome-apps/tree/master/apps/quickstart-react)
- [monday.com Developer Center](https://developer.monday.com/apps/docs/the-developer-center)
- [monday.com Apps SDK Documentation](https://developer.monday.com/apps/docs/introduction-to-the-sdk)
- [Vibe Design System](https://vibe.monday.com/v2/?path=/docs/welcome--docs)
