import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import CreateFreeTalk from '../components/Freetalk/CreateFreeTalk.vue'
import FreeTalks from '../components/Freetalk/FreeTalks.vue'
import FreeTalk from '../components/Freetalk/FreeTalk.vue'
import Login from '../components/User/Login.vue'
import Signup from '../components/User/Signup.vue'
import Profile from '../components/Profile/Profile.vue'
import ProfileForOthers from '../components/Profile/ProfileForOthers.vue'
import Comment from '../components/Profile/Comment.vue'
import Reply from '../components/Profile/ReplyToComment.vue'
import DeleteComment from '../components/Profile/DeleteComment.vue'
import Attendance from '../components/Freetalk/Attendance.vue'


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
    path: '/profileforothers/:userId',
    name: 'ProfileForOthers',
    props: true,
    component: ProfileForOthers
  },
  {
    path: '/comment/:userId',
    name: 'Comment',
    component: Comment
  },
  {
    path: '/comment/reply/:commentId',
    name: 'Reply',
    component: Reply
  },
  {
    path: '/comment/reply/delete/:commentId',
    name: 'DeleteComment',
    component: DeleteComment
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
