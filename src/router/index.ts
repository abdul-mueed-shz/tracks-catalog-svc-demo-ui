import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import DiscoverPage from '@/pages/DiscoverPage.vue'
import TracksPage from '@/pages/TracksPage.vue'
import ArtistsPage from '@/pages/ArtistsPage.vue'
import ArtistDetailPage from '@/pages/ArtistDetailPage.vue'
import DocsPage from '@/pages/DocsPage.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'discover',
        component: DiscoverPage,
        meta: { title: 'Discover' }
      },
      {
        path: 'tracks',
        name: 'tracks',
        component: TracksPage,
        meta: { title: 'Tracks Catalog' }
      },
      {
        path: 'artists',
        name: 'artists',
        component: ArtistsPage,
        meta: { title: 'Artists & Aliases' }
      },
      {
        path: 'artists/:id',
        name: 'artist-detail',
        component: ArtistDetailPage,
        meta: { title: 'Artist Profile' }
      },
      {
        path: 'docs',
        name: 'docs',
        component: DocsPage,
        meta: { title: 'API & Architecture' }
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach(to => {
  const title = to.meta.title ? `${to.meta.title} | ICE Music` : 'ICE Music'
  document.title = title
})

export default router
