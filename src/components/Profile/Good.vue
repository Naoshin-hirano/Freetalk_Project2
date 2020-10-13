<template>
    <div>
        <v-btn v-show="likesIsRegistered" @click="favorite(post)" icon color="pink">
            <v-icon left>mdi-heart</v-icon>
        </v-btn>
        <v-btn v-show="!likesIsRegistered" @click="favorite(post)" icon >
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
        return this.$store.state.registeredLikes.findIndex(uid=>{
            return uid === this.uid
        }) >= 0
      },
      registeredLikes(){
        return this.$store.state.registeredLikes
      }
    },
    methods: {
      favorite(like){
        const updateLike = {
          id : like.id,
          name: true
        }
        const updateDislike = {
          id: like.id,
          name: false
        }
        if(this.likesIsRegistered){
          this.$store.dispatch("unlikesFromFreetalk", updateDislike) 
        }else{
          this.$store.dispatch("likesForFreetalk", updateLike) 
        }
      }
    }
  }
  </script>