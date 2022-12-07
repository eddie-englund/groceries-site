import { validateSession, InvalidSessionError } from './../api/auth/index';
import { getRefreshToken, getSessionToken } from './../util/jwt-utils';
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/home-view.vue';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login-view.vue'),
    },
    //{
    //  path: '/about',
    //  name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    //  component: () => import('../views/AboutView.vue')
    //}
  ],
});

router.beforeEach(async (to) => {
  const test = pipe(
    TE.Do,
    TE.bind('refreshToken', () =>
      pipe(
        getRefreshToken(),
        TE.fromOption(() => new InvalidSessionError('No refresh token found')),
      ),
    ),
    TE.bind('sessionToken', () =>
      pipe(
        getSessionToken(),
        TE.fromOption(() => new InvalidSessionError('No session token found')),
      ),
    ),
    TE.bind('validateSession', () => validateSession()),
  );

  return await pipe(
    test,
    TE.match(
      (left) => {
        console.error(left);
        if (to.name !== 'login') return { path: '/login' };
        return undefined;
      },
      () => undefined,
    ),
  )();
});

export default router;
