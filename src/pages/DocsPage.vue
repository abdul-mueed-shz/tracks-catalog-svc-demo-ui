<template>
  <q-page class="q-pa-lg">
    <div class="column q-gutter-y-xl" style="max-width: 1000px; margin: 0 auto">
      <!-- Title Header -->
      <div>
        <h1 class="text-h4 text-weight-bolder text-white q-my-none flex items-center">
          <q-icon name="code" color="primary" class="q-mr-sm" size="32px" />
          API & Architecture Documentation
        </h1>
        <p class="text-caption text-grey-5 q-mt-xs q-mb-none">
          Deep-dive into the OpenAPI specifications, Hexagonal Ports & Adapters architecture, Keyset pagination, and Redis caching.
        </p>
      </div>

      <!-- Quick Stats Strip -->
      <div class="row q-col-gutter-md">
        <div class="col-6 col-md-3">
          <div class="glass-panel q-pa-md text-center">
            <div class="text-h4 text-weight-bolder text-primary">6</div>
            <div class="text-caption text-grey-4">REST Endpoints</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="glass-panel q-pa-md text-center">
            <div class="text-h4 text-weight-bolder text-secondary">O(1)</div>
            <div class="text-caption text-grey-4">Keyset Scroll</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="glass-panel q-pa-md text-center">
            <div class="text-h4 text-weight-bolder text-accent">24h</div>
            <div class="text-caption text-grey-4">Redis Cache TTL</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="glass-panel q-pa-md text-center">
            <div class="text-h4 text-weight-bolder text-amber-4">UUID</div>
            <div class="text-caption text-grey-4">Public Key Identity</div>
          </div>
        </div>
      </div>

      <!-- API Endpoints Reference Table -->
      <section class="glass-panel q-pa-lg">
        <div class="text-h6 text-weight-bolder text-white flex items-center q-mb-md">
          <q-icon name="api" color="primary" class="q-mr-sm" size="24px" />
          Catalog Service OpenAPI Endpoints
        </div>

        <div class="overflow-auto">
          <table class="api-table full-width text-caption">
            <thead>
              <tr class="text-left text-grey-4 text-weight-bold">
                <th class="q-pa-sm">Method</th>
                <th class="q-pa-sm">Endpoint</th>
                <th class="q-pa-sm">Description</th>
                <th class="q-pa-sm">Parameters / Body</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ep in endpoints" :key="ep.path + ep.method" class="api-table-row">
                <td class="q-pa-sm">
                  <q-badge
                    dense
                    :color="getMethodColor(ep.method)"
                    text-color="dark"
                    class="text-weight-bold text-uppercase"
                  >
                    {{ ep.method }}
                  </q-badge>
                </td>
                <td class="q-pa-sm text-mono text-white text-weight-bold">{{ ep.path }}</td>
                <td class="q-pa-sm text-grey-3">{{ ep.desc }}</td>
                <td class="q-pa-sm text-mono text-grey-5">{{ ep.params }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Architectural Principles -->
      <section class="glass-panel q-pa-lg">
        <div class="text-h6 text-weight-bolder text-white flex items-center q-mb-md">
          <q-icon name="architecture" color="secondary" class="q-mr-sm" size="24px" />
          Hexagonal Architecture (Ports & Adapters)
        </div>

        <div class="column q-gutter-y-md text-caption text-grey-3" style="line-height: 1.7">
          <p>
            The backend strictly adheres to <strong>Hexagonal Architecture</strong> and <strong>Domain-Driven Design (DDD)</strong>.
            The domain core has zero external framework dependencies—no JPA annotations, no Spring stereotypes, and no HTTP contracts.
          </p>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="glass-panel-subtle q-pa-md rounded-borders">
                <div class="text-subtitle2 text-weight-bold text-primary q-mb-xs">
                  Inbound (Driving) Adapters
                </div>
                <div>
                  REST Controllers (<code>UserController</code>, <code>TrackController</code>, <code>ArtistOfTheDayController</code>)
                  and scheduled cron jobs map incoming HTTP requests into pure Java domain use case invocations.
                </div>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="glass-panel-subtle q-pa-md rounded-borders">
                <div class="text-subtitle2 text-weight-bold text-secondary q-mb-xs">
                  Outbound (Driven) Adapters
                </div>
                <div>
                  PostgreSQL JPA repositories implement domain repository contracts (outbound ports). Keyset cursor pagination and Redis 7 distributed caching reside strictly within outbound adapters.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Keyset Pagination & Redis Caching Deep Dive -->
      <section class="glass-panel q-pa-lg">
        <div class="text-h6 text-weight-bolder text-white flex items-center q-mb-md">
          <q-icon name="speed" color="accent" class="q-mr-sm" size="24px" />
          Keyset Pagination & Artist of the Day Rotation
        </div>

        <div class="column q-gutter-y-sm text-caption text-grey-3" style="line-height: 1.7">
          <p>
            <strong>Keyset Cursor Pagination:</strong> Traditional <code>OFFSET</code> pagination degrades linearly to $O(N)$
            and causes duplicate items during concurrent track uploads. Keyset pagination encodes an opaque Base64 token
            referencing the timestamp and ID of the last fetched item, guaranteeing $O(1)$ query execution against indexed columns.
          </p>
          <p>
            <strong>Fair Circular Rotation Sequence:</strong> If there are $N$ artists in the catalog, each day an atomic database
            lock assigns the next consecutive artist ID to today's date and caches the result for 24 hours in Redis.
            After $N$ days, the cycle seamlessly restarts, guaranteeing an equal opportunity for all creators.
          </p>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const endpoints = [
  {
    method: 'GET',
    path: '/catalog-svc/artist-of-the-day',
    desc: 'Fetches current daily featured artist (cached 24h in Redis)',
    params: 'None'
  },
  {
    method: 'GET',
    path: '/catalog-svc/tracks',
    desc: 'Keyset scroll query with artist, title, or alias filters',
    params: 'userId, userName, size, cursor, property, direction'
  },
  {
    method: 'POST',
    path: '/catalog-svc/tracks/user/{userId}/add',
    desc: 'Adds a new track to an artist catalog',
    params: 'Body: { title, genre, durationMs, releaseDate }'
  },
  {
    method: 'GET',
    path: '/catalog-svc/users',
    desc: 'List catalog users or artists with cursor pagination',
    params: 'isArtist, size, cursor, property, direction'
  },
  {
    method: 'POST',
    path: '/catalog-svc/users',
    desc: 'Register a new artist or listener',
    params: 'Body: { name, isArtist }'
  },
  {
    method: 'PATCH',
    path: '/catalog-svc/users/{userId}',
    desc: 'Update artist stage name (archives prior name to aliases)',
    params: 'Body: { name }'
  },
  {
    method: 'GET',
    path: '/catalog-svc/users/{userId}/aliases',
    desc: 'Fetch historical aliases archived for an artist',
    params: 'Path: {userId}'
  },
  {
    method: 'GET',
    path: '/catalog-svc/actuator/health',
    desc: 'Spring Boot actuator health probe',
    params: 'None'
  }
]

function getMethodColor(method: string): string {
  switch (method) {
    case 'GET': return 'primary'
    case 'POST': return 'accent'
    case 'PATCH': return 'secondary'
    case 'DELETE': return 'negative'
    default: return 'grey-5'
  }
}
</script>

<style scoped lang="scss">
.api-table {
  border-collapse: collapse;
}

.api-table-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }
}

.text-mono {
  font-family: 'JetBrains Mono', monospace;
}
</style>
