<template>
  <v-row justify="center">
    <v-dialog v-model="editDialog" persistent width="800px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          fab accent
          text>
           <v-icon class="hidden-xs-only mr-4" large>mdi-pencil</v-icon>
           <v-icon class="hidden-sm-and-up" >mdi-pencil</v-icon>
        </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap>
                 <v-flex xs12>
                     <v-card-title>{{$t('edit_freetalk')}}</v-card-title>
                 </v-flex>
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-flex xs12>
                     <v-card-text>
                        <v-text-field
                            name="title"
                            :label="$t('name_of_freetalk')"
                            id="title"
                            v-model="editedTitle"
                            required>
                        </v-text-field>
                        <v-textarea
                            name="description"
                            :label="$t('description')"
                            id="description"
                            v-model="editedDescription"
                            required>
                        </v-textarea>
                     </v-card-text>
                 </v-flex>
             </v-layout>
             <v-divider></v-divider>
             <v-layout>
                 <v-flex>
                     <v-card-actions>
                         <v-btn @click="editDialog=false" text class="red--text darken-1">
                           <h3 class="hidden-xs-only">{{$t('close')}}</h3>
                           <span class="hidden-sm-and-up">{{$t('close')}}</span>
                         </v-btn>
                         <v-btn @click="onSaveChanges" text class="green--text darken-1">
                          <h3 class="hidden-xs-only">{{$t('change')}}</h3>
                          <span class="hidden-sm-and-up">{{$t('change')}}</span>
                         </v-btn>
                     </v-card-actions>
                 </v-flex>
             </v-layout>
         </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    props: ["freetalk"],
    data () {
      return {
        //編集画面のダイアログ
        editDialog: false,
        //編集情報の初期値
        editedTitle: this.freetalk.title,
        editedDescription: this.freetalk.description
      }
    },
    methods: {
      //編集した情報に変更更新
      onSaveChanges(){
        if(this.editedTitle.trim() === "" || this.editedDescription.trim() === ""){
          return
        }
        this.editDialog = false
        this.$store.dispatch("updateFreetalkData",{
          id: this.freetalk.id,
          title: this.editedTitle,
          description: this.editedDescription
        })
      }
    }
  }
</script>