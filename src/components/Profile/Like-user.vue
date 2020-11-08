<template>
    <div>
        <v-btn v-show="likesIsRegistered" @click="unfavorite" icon color="pink">
            <v-icon left>mdi-heart</v-icon>
        </v-btn>
        <v-btn v-show="!likesIsRegistered" @click="favorite" icon >
            <v-icon left>mdi-heart</v-icon>
        </v-btn>
        <span>{{ registeredLikes.length }} LIKES</span>
    </div>
</template>

<script>
  export default {
    data(){
      return {
        registerDialog: false,
        uid: this.$store.getters.user.id
      }
    },
    computed: {
      likesIsRegistered(){
        return this.$store.state.user.likes.findIndex(key=>{
            return key === this.uid
        }) >= 0
      },
      registeredLikes(){
        return this.$store.state.user.likes
      }
    },
    methods: {
      favorite(){
          this.$store.dispatch("likesForUser", this.uid) 
      },
      unfavorite(){
          this.$store.dispatch("unlikesForUser", this.uid) 
      }
    }
  }
  </script>