<template>
  <v-app>
     <v-navigation-drawer
      app
      v-model="drawer"
      temporary>
        <v-list-item>
            <v-list-item-content>
                <v-avatar>
                   <img v-if="photoURL" :src="photoURL">
                </v-avatar>
            </v-list-item-content>
            <v-list-item-content>
                <v-list-item-title>{{ userName }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-for="item in menuItems" 
                     :key="item.title"
                     :to="item.link">
            <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
             {{ item.title }}
        </v-list-item>
        <v-list-item  @click="logout" v-show="this.userIsAuthenticated" to="/">
            <v-list-item-icon>
                 <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            {{$t('logout')}}
        </v-list-item>
        <v-select
              :items="items"
              label="Language"
              item-text="langu"
              v-model="items.langu"
              @change="changeLangu(`${items.langu}`)"
              class="mt-5 mr-5 ml-5"
              height="30"
              dense
              autowidth
            ></v-select> 
    </v-navigation-drawer>
    <v-app-bar
      app
      color="indigo accent-3"
      dark>
        <v-app-bar-nav-icon
          @click.stop="drawer = !drawer"
          class="hidden-sm-and-up">
        </v-app-bar-nav-icon>
        <v-toolbar-title>
           <router-link to="/" tag="span" style="cursor: pointer">FREE TALK !</router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-xs-only">
            <v-btn text v-for="item in menuItems"
                         :key="item.title"
                         :to="item.link"
                         >
              <v-icon medium left>{{ item.icon }}</v-icon>
                 {{ item.title }}
            </v-btn>
            <v-btn text @click="logout" v-show="this.userIsAuthenticated" to="/">
               <v-icon left>mdi-logout</v-icon>
                {{$t('logout')}} 
            </v-btn>
            <v-select
              :items="items"
              label="Language"
              item-text="langu"
              v-model="items.langu"
              @change="changeLangu(`${items.langu}`)"
              class="mt-5 ml-5"
              height="30"
              dense
              autowidth
            ></v-select> 
        </v-toolbar-items>
    </v-app-bar>
    <v-main class="grey lighten-3 ma-2">
        <router-view/>
    </v-main>
    <Footer/>
  </v-app>
</template>

<script>
import Footer from './components/Footer.vue'
export default {
  components: { Footer },
  name: 'app',
  data: () => ({
    drawer : false,
    items: [
      {langu: "Japanese", mark: "ja"},
      {langu: "English", mark: "en"}
    ]
  }),
  computed: {
    menuItems(){
     let menuItems = [
       {icon: "mdi-login", title: this.$i18n.locale === 'ja' ? "ログイン" : "Login", link:"/login"},
       {icon: "mdi-account-check", title: this.$i18n.locale === 'ja' ? "新規登録" : "Sign Up", link:"/signup"},
     ]
     if(this.userIsAuthenticated){
       menuItems = [
       {icon: "mdi-account-multiple", title: "FREETALKS", link:"/freetalks"},
       {icon: "mdi-google-maps", title: this.$i18n.locale === 'ja' ? "投稿する" : "Create", link:"/freetalk/new"},
       {icon: "mdi-home", title: this.$i18n.locale === 'ja' ? "マイページ" : "My Page", link:"/profile/" + this.user.id}
        ]
      }
      return menuItems
    },
    //ユーザーのログインステータス
    userIsAuthenticated(){
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    },
    userName(){
      return this.$store.getters.userName
    },
    photoURL(){
      return this.$store.getters.photoURL
    },
    user(){
      return this.$store.getters.user
    }
  },
  methods: {
    //ログアウトメソッド
    logout(){
      this.$store.dispatch("logout")
      this.drawer = false
    },
    //言語切替メソッド
    changeLangu(a){
      if(a === "Japanese"){
        this.$i18n.locale = "ja"
      }else{
        this.$i18n.locale = "en"
      }
    }
  }
};
</script>