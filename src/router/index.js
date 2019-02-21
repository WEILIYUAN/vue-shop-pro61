import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import User from '@/components/User'
import Rights from '@/components/Rights'
import Role from '@/components/Role'


Vue.use(Router)

var router = new Router({
  routes: [
    {path: '/login', component: Login},
    {path: '/', redirect:'/home'},
    {path: '/home', 
    component: Home, 
    redirect: '/welcome', 
    children :[
      {path: '/welcome', component: Welcome},
      {path: '/users', component: User},
      {path: '/rights', component: Rights},
      {path: '/roles', component: Role}

    ]}
  ]
})

router.beforeEach((to,from,next) => {
  if (to.path === '/login') 
  {
    return next()
  }
  var token = window.sessionStorage.getItem('token')
  if(!token) {
    return next('/login')
  }
  next()
})

export default router
