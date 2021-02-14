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
import Reply from './components/Profile/ReplyToComment.vue'
import ShowReply from './components/Profile/ShowReplyList.vue'
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
import MyTabs from './components/Profile/MyTabs.vue'
import TabsForOthers from './components/Profile/TabsForOthers.vue'
import FollowUser from './components/User/FollowUser.vue'


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
Vue.component('reply-btn', Reply)
Vue.component('show-reply-list', ShowReply)
Vue.component('edit-profile', EditProfile)
Vue.component('likes-btn', LikesButton)
Vue.component('show-attendees', ShowAttendees)
Vue.component('delete-comment', DeleteComment)
Vue.component('delete-reply', DeleteReply)
Vue.component('follow-user', FollowUser)
Vue.component('my-tabs', MyTabs)
Vue.component('tabs-for-others', TabsForOthers)

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
        this.$router.push({name: 'Home'})
      }else{
        this.$store.dispatch("deleteLoginUser")
      }
    }),
    this.$store.dispatch('loadedFreeTalks')
    this.$store.dispatch('loadedAttendance')
    this.$store.dispatch("loadedFav")
  }
}).$mount('#app')
