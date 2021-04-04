<template>
  <v-row>
    <v-dialog persistent width="380" v-model="registerDialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
        text
        v-bind="attrs"
        v-on="on">
         <v-icon>mdi-delete-forever</v-icon>
        </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap>
                <v-card-title class="hidden-xs-only">このコメントと返信を削除しますか?</v-card-title>
                <v-card-text class="hidden-sm-and-up">このコメントと返信を削除しますか?</v-card-text>
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-card-actions>
                        <v-btn
                        class="red--text darken-1"
                        text
                        @click="registerDialog = false">
                        <h3 class="hidden-xs-only">キャンセル</h3>
                        <span class="hidden-sm-and-up">キャンセル</span>
                        </v-btn>
                        <v-btn
                        class="green--text darken-1"
                        text
                        >
                        <h3 @click="deleteComment" class="hidden-xs-only">削除</h3>
                        <span @click="deleteComment" class="hidden-sm-and-up">削除</span>
                        </v-btn>
                 </v-card-actions>
             </v-layout>
         </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    props: ["commentId"],//commentId
    data(){
      return {
        registerDialog: false
      }
    },
    methods: {
      deleteComment(){
        this.$store.dispatch("deleteComment", this.commentId)
        this.registerDialog = false
        }
      }
    }
</script>