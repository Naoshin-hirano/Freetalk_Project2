<template>
    <v-container>
        <v-layout>
            <v-flex xs12 sm6 offset-sm3 mb-4>
                <h2>Create FreeTalk</h2>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12 sm6 offset-sm3>
                <form @submit.prevent="onCreateTalk">
                    <v-layout>
                        <v-flex>
                            <v-text-field
                                label="Title"
                                name="title"
                                id="title"
                                v-model="title"
                                required
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout>
                        <v-flex>
                            <v-text-field
                                label="Location"
                                name="location"
                                id="location"
                                v-model="location"
                                required
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                       <v-flex>
                           <v-btn raised class="white--text cyan darken-1" @click="onPickFile">Upload Image</v-btn>
                           <input type="file" 
                                  style="display: none" 
                                  ref="fileInput"
                                  accept="image/*"
                                  @change="onFilePicked">
                       </v-flex>
                   </v-layout>
                   <v-layout row>
                       <v-flex>
                           <img :src="imageUrl" height="150">
                       </v-flex>
                   </v-layout>
                    <v-layout>
                        <v-flex>
                            <v-textarea
                                label="Description"
                                name="description"
                                id="description"
                                v-model="description"
                                required>
                            </v-textarea>
                        </v-flex>
                    </v-layout>
                     <v-layout mb-3>
                        <v-flex>
                            <h2>Choose Date and Time</h2>
                        </v-flex>
                    </v-layout>
                    <v-layout mb-4>
                        <v-flex>
                            <v-date-picker
                            color="cyan darken-1"
                            elevation="15"
                            v-model="date"
                            ></v-date-picker>
                        </v-flex>
                    </v-layout>
                    <v-layout mb-4>
                        <v-flex>
                            <v-time-picker
                            color="cyan darken-1"
                            format="24hr"
                            scrollable
                            elevation="15"
                            v-model="time"
                            ></v-time-picker>
                        </v-flex>
                    </v-layout>
                    <v-layout>
                        <v-flex xs12 sm6 offset-sm3 mb-4>
                            <v-btn :disabled="!formIsValid" 
                                dark 
                                color="red darken-2"
                                type="submit">Create Freetalk               
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </form>
            </v-flex>
        </v-layout>    
    </v-container>
</template>

<script>
export default {
    data(){
      return {
        title: "",
        location: "",
        imageUrl: "",
        description: "",
        date: "",
        time: new Date(),
        image: null
      }
    },
    computed: {
      formIsValid(){
       return this.title !== "" &&
        this.location !== "" && 
        this.imageUrl !== "" && 
        this.description !== ""
    },
      submittableDateTime(){
        const date = new Date(this.date)
        if(typeof this.time === "string"){//数字の表示の仕方
        const hours = this.time.match(/^(\d+)/)[1]
        const minutes = this.time.match(/:(\d+)/)[1]
        date.setHours(hours)
        date.setMinutes(minutes)
        }else{//何の数字を表示するか
        date.setHours(this.time.getHours())
        date.setMinutes(this.time.getMinutes())
        }
        return date
     }
  },
  methods: {
      //画像アップロード機能
    onPickFile(){
      this.$refs.fileInput.click()
    },
    onFilePicked (event) {
        const files = event.target.files
        let filename = files[0].name
        if (filename.lastIndexOf('.') <= 0) {
        return alert('Please add a valid file!')
        }
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
        })
        fileReader.readAsDataURL(files[0])
        this.image = files[0]
     },
    onCreateTalk(){//submit押した時のmethods
        if(!this.formIsValid){
           return
        }
       const talkData = {
        title: this.title,
        location: this.location,
        image: this.image,
        description: this.description,
        date: this.submittableDateTime
      }
      this.$store.dispatch("createTalk", talkData)//awaite
      this.$router.push({name: 'FreeTalks'})
    }
  }
}
</script>