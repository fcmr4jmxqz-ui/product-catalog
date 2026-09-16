# Product Catalog App

A React Native product catalog app built for the Junior Mobile Developer technical assessment.

## Tech Stack

* React Native
* Expo
* TypeScript
* Axios
* React Navigation
* DummyJSON API

## Features

### Required

* Product list — title, thumbnail, price
* Pagination — load more products on scroll
* Product detail — description, price, rating, images
* Loading, error, retry, empty and success states
* Debounced product search using DummyJSON search endpoint
* Separated API and UI layers

### Bonus / UI/UX

* Pull-to-refresh
* Image loading indicator
* Image error fallback / `No image` placeholder
* Product image gallery with previous/next navigation
* Image counter
* Skeleton loading cards
* Retry success notification
* Reusable `ProductCard` component

## Architecture

```text
src/
├── api/
│   └── ProductApi.ts
├── types/
│   ├── Product.ts
│   └── Navigation.ts
├── screens/
│   ├── ProductListScreen.tsx
│   └── ProductDetailScreen.tsx
└── components/
    ├── ProductCard.tsx
    ├── ProductCardSkeleton.tsx
    └── EmptyState.tsx
```

* `api/` — API/data layer
* `screens/` — screen-level UI and state
* `components/` — reusable UI components
* `types/` — shared TypeScript types

API logic is separated from the UI to keep the code organized and easier to maintain and test.

## How to Run

```bash
npm install
npx expo start
```

## Setup

```bash
git clone <repository-url>
cd product-catalog
npm install
npx expo start
```

Scan the QR code with Expo Go or open the app in an available simulator.

No additional backend setup is required. The app uses the public DummyJSON API.

Open the app using Expo Go or an available simulator.

## TODOs

* [ ] Improve pagination error handling so existing products remain visible when loading the next page fails.
* [ ] Add unit tests for data/business logic.
* [ ] Add product thumbnail selection on the detail screen.
* [ ] Improve search to support title-only matching.
* [ ] Add "No search results" state.
* [ ] Improve image retry handling.
* [ ] Improve accessibility.
* [ ] Add category filtering/sorting.

## AI Assistance

AI was used as a learning and development aid for:

* React Native / TypeScript explanations
* Debugging and troubleshooting
* API and architecture guidance
* UI/UX suggestions

All implemented logic was reviewed and understood during development.
