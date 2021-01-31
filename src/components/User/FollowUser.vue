<template>
    <div>
        <v-btn
        fab accent
        text
        v-if="!highly_rated"
        @click.prevent="follow">
         <v-icon left large color="orange darken-2">mdi-star-outline</v-icon>
         {{ followers ? followers.length : 0 }} 高評価する
        </v-btn>
        <v-btn
        fab accent
        text
        v-else
        @click.prevent="unFollow">
         <v-icon large color="orange darken-2">mdi-star</v-icon>
          {{ followers ? followers.length : 0 }} 高評価を解除する
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
      highly_rated(){//ture/falseになってた
             return this.$store.getters.user.following.findIndex(uid =>{
            return uid === this.id[this.id.length - 1]
          }) >= 0
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
      this.highly_rated = !this.highly_rated
      this.$store.dispatch("getFollowing", this.id[this.id.length - 1])
      this.$store.dispatch("getFollowers", this.id[this.id.length - 1])
    },
    unFollow(){
      this.highly_rated = !this.highly_rated
      this.$store.dispatch("deleteFollowing", this.id[this.id.length - 1])
      this.$store.dispatch("deleteFollowers", this.id[this.id.length - 1])
    }
  }
}
</script>

  
