import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import CreateFreeTalk from '../components/Freetalk/CreateFreeTalk.vue'
import FreeTalks from '../components/Freetalk/FreeTalks.vue'
import FreeTalk from '../components/Freetalk/FreeTalk.vue'
import Login from '../components/User/Login.vue'
import Signup from '../components/User/Signup.vue'
import UserRegisteredInfo from '../components/User/UserRegisteredInfo.vue'
import Profile from '../components/User/Profile.vue'
import ProfileForOthers from '../components/User/ProfileForOthers.vue'
import Comment from '../components/User/Comment.vue'
import Attendance from '../components/Freetalk/Attendance.vue'
import Overview from '../components/Overview.vue'


Vue.use(VueRouter)
  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {title: "freetalk"}
  },
  {
    path: '/freetalk/new',
    name: 'CreateFreeTalk',
    component: CreateFreeTalk
  },
  {
    path: '/freetalks',
    name: 'FreeTalks',
    component: FreeTalks
  },
  {
    path: '/overview',
    name: 'Overview',
    component: Overview
  },
  {
    path: '/freetalks/:id',
    name: 'FreeTalk',
    props: true,
    component: FreeTalk
  },
  {
    path: '/freetalks/:id/attendance',
    name: 'Attendance',
    props: true,
    component: Attendance
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/profile/:userId',
    name: 'Profile',
    props: true,
    component: Profile,
  },
  {
    path: '/userRegisteredInfo',
    name: 'UserRegisteredInfo',
    props: true,
    component: UserRegisteredInfo
  },
  {
    path: '/profileforothers/:userId',
    name: 'ProfileForOthers',
    props: true,
    component: ProfileForOthers
  },
  {
    path: '/comment/:userId',
    name: 'Comment',
    component: Comment
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)}

export default router
