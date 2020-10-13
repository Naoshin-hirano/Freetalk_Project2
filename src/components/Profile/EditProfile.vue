<template>
  <v-row justify="center" >
    <v-dialog v-model="editDialog" persistent width="400px">
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
                     <v-card-title>Edit Profile</v-card-title>
                 </v-flex>
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-flex xs12>
                     <v-card-text>
                        <v-text-field
                            name="userName"
                            label="UserName"
                            id="userName"
                            v-model="userName"
                            required>
                        </v-text-field>
                        <v-textarea
                            name="introduction"
                            label="Introduction"
                            id="introduction"
                            v-model="introduction"
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
                         <v-btn @click="onSaveProfile" text class="blue--text darken-1">Save</v-btn>
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
    data () {
      return {
        editDialog: false,
        userName: this.$store.getters.userName,
        photoURL: this.$store.getters.photoURL,
        introduction: this.$store.getters.introduction,
      }
    },
    methods: {
      onSaveProfile(){
        this.$store.dispatch("updateProfile",{
          id: this.$store.getters.user.id,
          displayName: this.userName,
          photoURL: this.photoURL,
          introduction: this.introduction
        })
        this.editDialog = false
      }
    }
  }
</script>