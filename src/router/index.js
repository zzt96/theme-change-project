import Vue from 'vue'
import Router from 'vue-router'
import example from '@/components/example'
import rotate from '@/components/rotate'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: example
    },
    {
      path: '/rotate',
      name: 'rotate',
      component: rotate
    }
  ]
})
