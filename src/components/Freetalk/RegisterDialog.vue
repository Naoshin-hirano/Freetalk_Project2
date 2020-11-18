<template>
  <v-row>
    <v-dialog persistent width="350px" v-model="registerDialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
        dark color="red darken-2"
        v-bind="attrs"
        v-on="on">
        {{  userIsRegistered ? "Unregister" : "Register" }}
        </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap>
                <v-card-title v-if="userIsRegistered">Unregister from this Freetalk ?</v-card-title>
                <v-card-title v-else>Register for this Freetalk ?</v-card-title>
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-card-actions>
                        <v-btn
                        class="blue--text darken-1"
                        text
                        @click="registerDialog = false">Cancel</v-btn>
                        <v-btn
                        class="blue--text darken-1"
                        text
                        @click="onAgree">Confirm</v-btn>
                 </v-card-actions>
             </v-layout>
         </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    props: ["freetalkId"],
    data(){
      return {
        registerDialog: false
      }
    },
    computed: {
      userIsRegistered(){
        return this.$store.getters.user.registeredFreetalks.findIndex(freetalkId=>{
            return freetalkId === this.freetalkId
        }) >= 0
      }
    },
    methods: {
      onAgree(){
        if(this.userIsRegistered){
          this.$store.dispatch("unregisterUserFromFreetalk", this.freetalkId) 
        }else{
          this.$store.dispatch("registerUserForFreetalk", this.freetalkId) 
        }
      }
    }
  }
</script>