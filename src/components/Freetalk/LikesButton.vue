<template>
    <div>
        <v-btn
        fab accent
        text
        v-if="!fav_status"
        @click.prevent="favorite">
         <v-icon large color="pink darken-1">mdi-heart-outline</v-icon>
         {{ counter.length }}
        </v-btn>
        <v-btn
        fab accent
        text
        v-else
        @click.prevent="unfavorite">
         <v-icon large color="pink darken-1">mdi-cards-heart</v-icon>
         {{ counter.length }}
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
    computed: {
      user(){
        return this.$store.getters.user
      },
      fav_status(){
        const favs = this.$store.state.favs
        return favs.some((fav) =>{
          return fav.freetalkId.match(this.id[this.id.length - 1])
          && fav.uid.match(this.user.id)
        })
      },
      getFavs(){
        const favs = this.$store.state.favs
        return favs.filter((fav) =>{
          return fav.freetalkId.match(this.id[this.id.length - 1])
          && fav.uid.match(this.user.id)
        })
      },
      getKey(){
        return this.getFavs.map(obj =>obj.favKey)
      },
      counter(){
        const favs = this.$store.state.favs
        return favs.filter((fav) =>{
          return fav.freetalkId.match(this.id[this.id.length - 1])
        })
      }
    },
    methods: {
      favorite(){
        this.$store.dispatch("createFavs", {
          uid: this.user.id,
          freetalkId: this.id[this.id.length - 1]
        })
      },
      unfavorite(){
        this.$store.dispatch("deleteFavs",{
          uid: this.user.id,
          freetalkId: this.id[this.id.length - 1],
          favKey: this.getKey
        })
      }
    }
}
</script>

  
