<template>
  <v-row justify="center" >
    <v-dialog v-model="editDialog" persistent width="350px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          fab accent>
           <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap>
                 <v-flex xs12>
                     <v-card-title>Edit Freetalk</v-card-title>
                 </v-flex>
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-flex xs12>
                     <v-card-text>
                        <v-text-field
                            name="title"
                            label="Title"
                            id="title"
                            v-model="editedTitle"
                            required>
                        </v-text-field>
                        <v-textarea
                            name="description"
                            label="Description"
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
                         <v-btn @click="editDialog=false" text class="blue--text darken-1">Close</v-btn>
                         <v-btn @click="onSaveChanges" text class="blue--text darken-1">Save</v-btn>
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
        editDialog: false,
        editedTitle: this.freetalk.title,
        editedDescription: this.freetalk.description
      }
    },
    methods: {
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