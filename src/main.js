import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import DateFilter from './filters/date.js'
import * as firebase from 'firebase'
import i18n from './i18n'
import EditFreeTalk from './components/Freetalk/EditFreeTalk.vue'
import EditDate from './components/Freetalk/EditDate.vue'
import EditTime from './components/Freetalk/EditTime.vue'
import Comment from './components/Profile/Comment.vue'
import RegisterDialog from './components/Freetalk/RegisterDialog.vue'
import DeleteFreeTalk from './components/Freetalk/DeleteFreeTalk.vue'
import DeleteUserAccount from './components/User/Delete-user.vue'
import AppAlert from './components/Shared/Alert.vue'
import Paginate from 'vuejs-paginate'
import EditProfile from './components/Profile/EditProfile'
import LikesButton from './components/Freetalk/LikesButton.vue'
import ShowAttendees from './components/Freetalk/ShowAttendees.vue'
import DeleteComment from './components/Profile/DeleteComment.vue'
import DeleteReply from './components/Profile/DeleteReply.vue'
import FollowUser from './components/User/FollowUser.vue'
import ProfileForAttendace from './components/Freetalk/ProfileForAttendace.vue'


Vue.config.productionTip = false
Vue.filter("date", DateFilter)
Vue.component("edit-free-talk", EditFreeTalk)
Vue.component("edit-date", EditDate)
Vue.component("edit-time", EditTime)
Vue.component("register-dialog", RegisterDialog)
Vue.component("delete-free-talk", DeleteFreeTalk)
Vue.component("delete-user-account", DeleteUserAccount)
Vue.component("app-alert", AppAlert)
Vue.component('paginate', Paginate)
Vue.component('comment-btn', Comment)
Vue.component('edit-profile', EditProfile)
Vue.component('likes-btn', LikesButton)
Vue.component('show-attendees', ShowAttendees)
Vue.component('delete-comment', DeleteComment)
Vue.component('delete-reply', DeleteReply)
Vue.component('follow-user', FollowUser)
Vue.component('profile-for-attendace', ProfileForAttendace)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  i18n,

  created(){
    firebase.initializeApp({
      apiKey: 'AIzaSyB3anahU7Xe6jd6bj52D7BjUBa0lA8Bxzg',
      authDomain: 'freetalk1.firebaseapp.com',
      databaseURL: 'https://freetalk1.firebaseio.com',
      projectId: 'freetalk1',
      storageBucket: 'gs://freetalk1.appspot.com/'
    }),
    firebase.auth().onAuthStateChanged(user =>{
      if(user){
        this.$store.dispatch("setLoginUser",user)
        this.$store.dispatch("fetchUserData")
        // this.$store.commit('onAuthStatusChanged', user.uid ? true : false)
        this.$store.dispatch('myfollows')
        this.$store.dispatch('myfollowers')
        this.$router.push({name: 'Home'})
      }else{
        this.$store.dispatch("deleteLoginUser")
      }
    }),
    this.$store.dispatch('loadedFreeTalks')
    this.$store.dispatch('loadedComments')
    this.$store.dispatch('loadedReplys')
    this.$store.dispatch('loadedAttendance')
    this.$store.dispatch("getFavs")
  }
}).$mount('#app')
