<template>
  <v-row>
    <v-dialog persistent width="350px" v-model="openDialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn text
               v-bind="attrs"
               v-on="on">
            <v-icon >mdi-delete-forever</v-icon>
        </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap>
                <v-card-title>返信を削除しますか？</v-card-title>
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-card-actions>
                        <v-btn
                        class="cyan darken-1"
                        text
                        @click="openDialog = false">Cancel</v-btn>
                        <v-btn
                        class="cyan darken-1"
                        text
                        @click="onAgree">Yes</v-btn>
                 </v-card-actions>
             </v-layout>
         </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    data(){
      return {
        openDialog: false,
        id: location.href.split("/")
      }
    },
    methods: {
        onAgree(){
            this.$store.dispatch("deleteReply",{
                commentId: this.id[this.id.length - 1]
            })
        }
    }
  }
</script>