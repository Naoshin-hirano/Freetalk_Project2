<template>
    <div>
        <v-btn
        fab accent
        text
        v-if="!fav_status"
        @click.prevent="favorite">
         <v-icon class="hidden-xs-only" large color="pink darken-1">mdi-heart-outline</v-icon>
         <v-icon class="hidden-sm-and-up"  color="pink darken-1">mdi-heart-outline</v-icon>
         {{ counter.length }}
        </v-btn>
        <v-btn
        fab accent
        text
        v-else
        @click.prevent="unfavorite">
         <v-icon class="hidden-xs-only" large color="pink darken-1">mdi-cards-heart</v-icon>
         <v-icon class="hidden-sm-and-up" color="pink darken-1">mdi-cards-heart</v-icon>
         {{ counter.length }}
        </v-btn>
    </div>
</template>

<script>
export default{
  props: ["freetalk"],
    computed: {
      user(){
        return this.$store.getters.user
      },
      fav_status(){
        return this.$store.getters.favs.findIndex(fav =>{
          return fav.freetalkId === this.freetalk.id 
          && fav.uid === this.user.id
        })>= 0
      },
      getFavs(){
        const favs = this.$store.getters.favs
        return favs.filter((fav) =>{
          return fav.freetalkId.match(this.freetalk.id)
          && fav.uid.match(this.user.id)
        })
      },
      getKey(){
        return this.getFavs.map(obj =>obj.favKey)
      },
      counter(){
        const favs = this.$store.getters.favs
        return favs.filter((fav) =>{
          return fav.freetalkId.match(this.freetalk.id)
        })
      },
    },
    methods: {
      favorite(){
        this.$store.dispatch("createFavs", {
          uid: this.user.id,
          freetalkId: this.freetalk.id
        })
      },
      unfavorite(){
        this.$store.dispatch("deleteFavs",{
          uid: this.user.id,
          freetalkId: this.freetalk.id,
          favKey: this.getKey
        })
      }
    }
}
</script>

  
