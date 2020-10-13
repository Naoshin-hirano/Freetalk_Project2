<template>
    <div>
        <v-btn v-show="likesIsRegistered" @click="onFavorite" icon color="pink">
            <v-icon left>mdi-heart</v-icon>
        </v-btn>
        <v-btn v-show="!likesIsRegistered" @click="onFavorite" icon >
            <v-icon left>mdi-heart</v-icon>
        </v-btn>
        <span>{{ postLikes.length }}</span>
    </div>
</template>

<script>
  export default {
    props:["freetalkId"],
    data(){
      return {
        registerDialog: false,
        likesData: {}
      }
    },
    computed: {
      likesIsRegistered(){
        return this.$store.state.postLikes.findIndex(freetalkId=>{
            return freetalkId === this.freetalkId
        }) >= 0
      },
      postLikes(){
        return this.$store.state.postLikes
      }
    },
    methods: {
      onFavorite(){
        if(this.likesIsRegistered){
          this.$store.dispatch("unlikesFromFreetalk", this.freetalkId) 
        }else{
          this.$store.dispatch("likesForFreetalk", this.freetalkId) 
        }
      }
    }
  }
  </script>
