<template>
    <div>
        <v-btn
        fab accent
        text
        v-if="!highly_rated"
        @click.prevent="follow"
        class="hidden-xs-only">
         <v-icon left large color="orange darken-2">mdi-star-outline</v-icon>
         <span>{{ followers ? followers.length : 0 }} 高評価する</span>
        </v-btn>
        <v-btn
        fab accent
        text
        v-if="!highly_rated"
        @click.prevent="follow"
        class="hidden-sm-and-up caption">
         <v-icon color="orange darken-2">mdi-star-outline</v-icon>
         <span>{{ followers ? followers.length : 0 }} 高評価する</span>
        </v-btn>

        <v-btn
        fab accent
        text
        v-if="highly_rated"
        @click.prevent="unFollow"
        class="hidden-xs-only">
         <v-icon large color="orange darken-2">mdi-star</v-icon>
          <span>{{ followers ? followers.length : 0 }} 高評価を解除する</span>
        </v-btn>
        <v-btn
        fab accent
        text
        v-if="highly_rated"
        @click.prevent="unFollow"
        class="hidden-sm-and-up caption">
         <v-icon color="orange darken-2">mdi-star</v-icon>
          <span>{{ followers ? followers.length : 0 }} 高評価を解除</span>
        </v-btn>
    </div>
</template>

<script>
export default{
  data(){
    return {
      id: location.href.split("/")
    }
  },
  created(){
       this.$store.dispatch("fetchOtherUserData", this.id[this.id.length - 1])
  },
  computed: {
      user(){
        return this.$store.getters.user
      },
      highly_rated(){
            return this.user ? this.user.following.findIndex(uid =>{
              return uid === this.id[this.id.length - 1]
            }) >= 0 : null
          },
      otherUser(){
          return this.$store.getters.otherUser 
      },
      followers(){
          return this.otherUser ? this.$store.getters.otherUser.followers : null
      }
  },
  methods: {
    follow(){
      this.$store.dispatch("getFollowing", this.id[this.id.length - 1])
      this.$store.dispatch("getFollowers", this.id[this.id.length - 1])
    },
    unFollow(){
      this.$store.dispatch("deleteFollowing", this.id[this.id.length - 1])
      this.$store.dispatch("deleteFollowers", this.id[this.id.length - 1])
    }
  }
}
</script>

  
