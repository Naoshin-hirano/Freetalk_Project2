<template>
  <v-row>
    <v-dialog persistent width="600px" v-model="dialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
        dark color="green darken-2"
        v-bind="attrs"
        v-on="on">
        {{ filterAttendance.length }}人の出席者
        </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap v-for="member in filterAttendance" :key="member.userName" mb-3>
                    <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                        <v-card class="lime accent-4">
                            <v-img :src="member.photoURL" width="60"></v-img>
                            <h4>{{ member.userName }}</h4>
                        </v-card>
                    </v-flex>
                </v-layout>
                <v-layout row wrap v-show="!filterAttendance.length">
                   <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
                        <v-card>
                           <v-card-text>No attendees
                           </v-card-text>
                        </v-card>
                   </v-flex>
                </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-card-actions>
                        <v-btn
                        class="blue--text darken-1"
                        text
                        @click="dialog = false">閉じる</v-btn>
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
          dialog: false
        }
      },
    computed: {
      filterAttendance(){
        return this.$store.getters.filterAttendance(this.$route.params.id)
      }
    },
    created(){
      console.log(this.filterAttendance)
    }
  }
</script>