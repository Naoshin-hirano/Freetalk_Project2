<template>
 <div>
   <v-btn
     text
     fab accent
     class="mx-0"
     v-if="!detailUser.follow_status"
     @click.prevent="follow(detailUser)"
     >
     <v-icon large color="pink darken-1">mdi-heart-outline</v-icon>
   </v-btn>
   <v-btn
     text
     fab accent
     class="mx-0"
     v-else
     @click.prevent="follow(detailUser)"
     >
     <v-icon large color="pink darken-1">mdi-cards-heart</v-icon>
   </v-btn>
 </div>
</template>

<script>

export default {
data () {
      return {
        id: location.href.split("/"),
      }
    },
 created() {
   const id = this.id[this.id.length - 1]
   this.$store.dispatch('getUser', id)
 },
 computed: {
   detailUser() {
     let array = this.$store.state.user.myfollows_users
     let check_user = this.$store.state.user.detail_user

     function checkAlreadyFollows(arr, id) {
       return arr.some(function(value) {
         return id === value.id
       })
     }
     if(checkAlreadyFollows(array, check_user.id)) {
       check_user.follow_status = true
     } else {
       check_user.follow_status = false
     }
     
     this.$store.state.user.myfollowers_users.forEach(user => {
       if(user.id === check_user.id) {
         check_user.followed_status = true
         Object.assign(check_user, check_user)
       }
     })
     return check_user
   }
 },
 methods: {
   follow(user) {
     this.$store.dispatch('follow', user)
   }
 }
}
</script>