import Vue from 'vue';
import VueRouter from 'vue-router';

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

import index from './components/index';
import posts from './components/posts';

const routes = [
    {
        path: "/index",
        name: "index",
        component: index
    },
    {
        path: "/posts",
        name: "posts",
        component: posts
    },
    {
        path: "/",
        redirect: "index"
    }
]

const router = new VueRouter({
    mode: 'history',
    routes: routes
});

export default router