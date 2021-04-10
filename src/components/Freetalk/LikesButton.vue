<template>
    <div>
        <v-btn
        fab accent
        text
        v-if="!fav_status"
        @click.prevent="favorite">
         <v-icon class="hidden-xs-only ml-4" large color="pink darken-1">mdi-heart-outline</v-icon>
         <v-icon class="hidden-sm-and-up"  color="pink darken-1">mdi-heart-outline</v-icon>
         {{ counter.length }}
        </v-btn>
        <v-btn
        fab accent
        text
        v-else
        @click.prevent="unfavorite">
         <v-icon class="hidden-xs-only ml-4" large color="pink darken-1">mdi-cards-heart</v-icon>
         <v-icon class="hidden-sm-and-up" color="pink darken-1">mdi-cards-heart</v-icon>
         {{ counter.length }}
        </v-btn>
    </div>
</template>

<script>
export default{
  props: ["freetalk"],
  beforeUpdate(){
      this.$store.dispatch("loadedFav")
   },
  computed: {
      //ユーザー情報
      user(){
        return this.$store.getters.user
      },
      //お気に入りのtrue/false
      fav_status(){
        return this.$store.getters.favs.findIndex(fav =>{
          return fav.freetalkId === this.freetalk.id 
          && fav.uid === this.user.id
        })>= 0
      },
      //お気に入りのカウンター
      counter(){
        const favs = this.$store.getters.favs
        return favs.filter((fav) =>{
          return fav.freetalkId.match(this.freetalk.id)
        })
      }
    },
    methods: {
      //お気に入り登録
      favorite(){
        this.$store.dispatch("createFavs", {
          uid: this.user.id,
          freetalkId: this.freetalk.id
        })
      },
      //お気に入り解除
      unfavorite(){
        this.$store.dispatch("deleteFavs",{
          uid: this.user.id,
          freetalkId: this.freetalk.id,
        })
      }
    }
}
</script>

  
