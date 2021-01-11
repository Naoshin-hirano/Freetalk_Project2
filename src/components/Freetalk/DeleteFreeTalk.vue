<template>
  <v-row>
    <v-dialog persistent width="350px" v-model="deleteDialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn fab accent
               v-bind="attrs"
               v-on="on" 
               text>
            <v-icon large>mdi-delete-forever</v-icon>
        </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap>
                <v-card-title>本当にこのFeetalkを削除しますか？</v-card-title>
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-card-actions>
                        <v-btn
                        class="blue--text darken-1"
                        text
                        @click="deleteDialog = false">キャンセル</v-btn>
                        <v-btn
                        class="blue--text darken-1"
                        text
                        @click="deleteConfirm">削除</v-btn>
                 </v-card-actions>
             </v-layout>
         </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    props: ["freetalk"],
    data(){
      return {
        deleteDialog: false
      }
    },
    methods: {
      deleteConfirm(){
         this.$store.dispatch("deleteTalk", this.freetalk)
         this.$router.push({name: 'Home'})
      }
    }
  }
</script>