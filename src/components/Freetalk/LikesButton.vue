<template>
    <div>
        <v-btn
        fab accent
        text
        v-if="!post.fav_status"
        @click.prevent="favorite(post)">
         <v-icon large color="pink darken-1">mdi-heart-outline</v-icon>
         {{ favLength.length }}
        </v-btn>
        <v-btn
        fab accent
        text
        v-else
        @click.prevent="favorite(post)">
         <v-icon large color="pink darken-1">mdi-cards-heart</v-icon>
         {{ favLength.length }}
        </v-btn>
    </div>
</template>

<script>
export default{
    created(){
      console.log(this.favLength.length)
    },
    methods: {
      favorite(post){
        this.$store.dispatch("createFav", post)
      }
    },
    computed: {
      favLength(){
        return this.$store.getters.favFilter(this.$route.params.id)
      },
      post(){
        let array = this.$store.state.myfavs
        let publicPost = []
        this.$store.state.loadedFreeTalks.forEach(element =>{//loadedFreeTalks.forEach

         function checkAlreadyFavs(arr, id){
           return arr.some(function(value){
             return id === value.id
            })
          }

         if(checkAlreadyFavs(array, element.id)){
           element.fav_status = true  
         }else{
           element.fav_status = false
         }
         publicPost.push(element)
        })//loadedFreeTalks.forEach

        let detailpost = {}
        publicPost.forEach(ele =>{
          let id = this.$route.params.id
          let detail_post = {}
          if(ele.id === id){
            detail_post = ele
          }
          Object.assign(detailpost, detail_post)//1に２をコピー
        })
        return detailpost
      }
    }
}
</script>

  
