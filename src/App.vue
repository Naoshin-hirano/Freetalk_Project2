<template>
  <v-app>
     <v-navigation-drawer
      color="cyan--text darken-1"
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
        <v-list-item  @click="logout" v-show="this.userIsAuthenticated">
            <v-list-item-icon>
                 <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            Logout
        </v-list-item>
    </v-navigation-drawer>
    <v-app-bar
      app
      color="cyan darken-1"
      dark>
        <v-app-bar-nav-icon
          @click.stop="drawer = !drawer"
          class="hidden-sm-and-up">
        </v-app-bar-nav-icon>
        <v-toolbar-title>
           <router-link to="/" tag="span" style="cursor: pointer">FREE TALK</router-link>
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
                ログアウト
            </v-btn>    
        </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>


export default {
  name: 'app',
  data: () => ({
    drawer : false
  }),
  computed: {
    menuItems(){
     let menuItems = [
       {icon: "mdi-login", title:"ログイン", link:"/login"},
       {icon: "mdi-account-check", title:"登録する", link:"/signup"},
     ]
     if(this.userIsAuthenticated){
       menuItems = [
       {icon: "mdi-account-multiple", title:"FreeTalkを見る", link:"/freetalks"},
       {icon: "mdi-google-maps", title:"FreeTalkを投稿", link:"/freetalk/new"},
       {icon: "mdi-home", title:"プロフィール", link:"/profile/" + this.user.id}
        ]
      }
      return menuItems
    },
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
    logout(){
      this.$store.dispatch("logout")
    }
  }
};
</script>

<style>

</style>
