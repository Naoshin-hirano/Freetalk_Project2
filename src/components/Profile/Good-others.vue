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
        registerDialog: false
      }
    },
    computed: {
    //クリックされた人のIDを引数へ入れたい
      uid(){
        return this.$store.getters.user.id
      },
      likesIsRegistered(){
        return this.$store.getters.registeredLikes.findIndex(uid=>{
            return uid === this.uid
        }) >= 0
      },
      registeredLikes(){
        return this.$store.getters.user.registeredLikes
      }
    },
    methods: {
      favorite(){
          this.$store.dispatch("likesForFreetalk", this.uid) 
      },
      unfavorite(){
          this.$store.dispatch("unlikesFromFreetalk", this.uid) 
      }
    }
  }
  </script>