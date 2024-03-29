<template>
    <v-container>
        <v-layout>
            <v-flex xs12 sm8 md8 lg6 offset-sm2 offset-md2 offset-lg3>
                <v-card>
                    <v-layout>
                        <v-flex xs12 sm10 offset-sm1 mb-4>
                            <h2 class="mt-5 ml-3">{{$t('post_freetalk')}}</h2>
                        </v-flex>
                    </v-layout>
                    <v-layout>
                        <v-flex xs12 sm10 offset-sm1>
                            <form @submit.prevent="onCreateTalk">
                                <v-layout>
                                    <v-flex>
                                        <v-select
                                            class="ml-3 mr-3"
                                            :label="$t('language')"
                                            name="language"
                                            id="language"
                                            v-model="language"
                                            required
                                            :items="items"
                                            filled
                                            dense
                                        ></v-select>
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex>
                                        <v-text-field
                                            :label="$t('name_of_freetalk')"
                                            name="title"
                                            id="title"
                                            v-model="title"
                                            required
                                            class="ml-3 mr-3"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex>
                                        <v-text-field
                                            :label="$t('location')"
                                            name="location"
                                            id="location"
                                            v-model="location"
                                            required
                                            class="ml-3 mr-3"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex>
                                        <v-btn
                                        raised class="white--text indigo accent-3 ml-6 mr-3" 
                                        @click="onPickFile">{{$t('image_upload')}}</v-btn>
                                        <input type="file" 
                                                style="display: none" 
                                                ref="fileInput"
                                                accept="image/*"
                                                @change="onFilePicked">
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex>
                                        <img :src="imageUrl" height="150" class="ml-6 mt-3 mb-4">
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex>
                                        <v-textarea
                                            :label="$t('description')"
                                            name="description"
                                            id="description"
                                            v-model="description"
                                            required
                                            class="ml-3 mr-3">
                                        </v-textarea>
                                    </v-flex>
                                </v-layout>
                                    <v-layout mb-3>
                                    <v-flex xs10 sm12 offset-xs2 offset-sm1>
                                        <h2>{{$t('date_time')}}</h2>
                                    </v-flex>
                                </v-layout>
                                <v-layout mb-4>
                                    <v-flex xs10 sm12 offset-xs1 offset-sm1>
                                        <v-date-picker
                                        color="indigo accent-3"
                                        elevation="15"
                                        v-model="date"
                                        ></v-date-picker>
                                    </v-flex>
                                </v-layout>
                                <v-layout mb-4>
                                    <v-flex xs10 sm12 offset-xs1 offset-sm1 mb-4>
                                        <v-time-picker
                                        color="indigo accent-3"
                                        format="24hr"
                                        scrollable
                                        elevation="15"
                                        v-model="time"
                                        ></v-time-picker>
                                    </v-flex>
                                </v-layout>
                                <v-layout>
                                    <v-flex xs10 sm12 offset-xs1 offset-sm1 mb-4>
                                        <v-btn :disabled="!formIsValid"
                                            width="100%"
                                            height="50" 
                                            dark 
                                            color="red darken-2"
                                            type="submit">{{$t('create_freetalk')}}              
                                        </v-btn>
                                        <v-alert
                                        v-show="!formIsValid"
                                        dense
                                        outlined
                                        type="error"
                                        >
                                        <p>{{$t('enter_all')}}</p>
                                        </v-alert>
                                    </v-flex>
                                </v-layout>
                            </form>
                        </v-flex>
                    </v-layout>  
            </v-card>
        </v-flex>
    </v-layout>
</v-container>
</template>

<script>
export default {
    data(){
      return {
        language: "",
        title: "",
        location: "",
        imageUrl: "",
        description: "",
        date: "",
        time: new Date(),
        image: null,
        items: ['English', 'Japanese', 'Spanish', "French"],
      }
    },
    computed: {
      //入力フォームのバリデーション
      formIsValid(){
       return this.language !== "" &&
        this.title !== "" &&
        this.location !== "" && 
        this.imageUrl !== "" && 
        this.description !== ""
    },
      //投稿した日付
      submittableDateTime(){
        const date = new Date(this.date)
        if(typeof this.time === "string"){
        //数字の表示の仕方
        const hours = this.time.match(/^(\d+)/)[1]
        const minutes = this.time.match(/:(\d+)/)[1]
        date.setHours(hours)
        date.setMinutes(minutes)
        }else{
        //何の数字を表示するか
        date.setHours(this.time.getHours())
        date.setMinutes(this.time.getMinutes())
        }
        return date
     }
  },
  methods: {
    //アップロードしたい画像をimgフォルダから選ぶ
    onPickFile(){
      this.$refs.fileInput.click()
    },
    //画像がstorageに保存＋URL画像が画面に表示
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
    //FREETALKを投稿
    onCreateTalk(){
        if(!this.formIsValid){
           return
        }
       const talkData = {
        language: this.language,
        title: this.title,
        location: this.location,
        image: this.image,
        description: this.description,
        date: this.submittableDateTime
      }
      this.$store.dispatch("createTalk", talkData)
      this.$router.push({name: 'FreeTalks'})
    }
  }
}
</script>