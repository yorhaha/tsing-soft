import Vue from 'vue';
import VueRouter from 'vue-router';

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

import index from './components/index';
import posts from './components/posts';
import write from './components/write';
import comment from './components/comment';
import about from './components/about';

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
        path: "/write",
        name: "write",
        component: write
    },
    {
        path: "/comment",
        name: "comment",
        component: comment
    },
    {
        path: "/about",
        name: "about",
        component: about
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