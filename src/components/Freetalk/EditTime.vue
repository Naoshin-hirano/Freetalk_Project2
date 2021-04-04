 <template>
  <v-row>
    <v-dialog persistent width="350px" v-model="editDialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
        text
        v-bind="attrs"
        v-on="on">
           <v-icon class="hidden-xs-only" large>mdi-clock-time-four-outline</v-icon>
           <v-icon class="hidden-sm-and-up">mdi-clock-time-four-outline</v-icon>
        </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap>
                 <v-flex xs12>
                     <v-card-title>時間を編集</v-card-title>
                 </v-flex> 
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-card-text>
                    <v-time-picker 
                    color="blue darken-1" 
                    v-model="editableTime" 
                    style="..." 
                    actions 
                    format="24hr">
                        <template>
                            <v-btn
                            class="red--text darken-1"
                            text
                            @click.native="editDialog = false">閉じる</v-btn>
                            <v-btn
                            class="green--text darken-1"
                            text
                            @click.native="onSaveChanges">保存</v-btn>
                        </template>
                    </v-time-picker>
                 </v-card-text>
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
        editableTime: null,
        editDialog: false
      }
    },
    created(){
      this.editableTime = new Date(this.freetalk.date)
      },
    methods: {
      onSaveChanges(){
        const newDate = new Date(this.freetalk.date)
        const hours = this.editableTime.match(/^(\d+)/)[1]
        const minutes = this.editableTime.match(/:(\d+)/)[1]
        newDate.setHours(hours)
        newDate.setMinutes(minutes)
        this.$store.dispatch("updateFreetalkData", {
          id: this.freetalk.id,
          date: newDate
        })
      }
    }
  }
</script>