import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import DateFilter from './filters/date.js'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import i18n from './i18n'
import Comment from './components/Profile/Comment.vue'
import AppAlert from './components/Shared/Alert.vue'
import Paginate from 'vuejs-paginate'


Vue.config.productionTip = false
Vue.filter("date", DateFilter)
Vue.component("app-alert", AppAlert)
Vue.component('paginate', Paginate)
Vue.component('comment-btn', Comment)

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
