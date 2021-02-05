import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { Notify } from 'quasar'
Vue.use(VueRouter, Notify)

export default function () {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}
