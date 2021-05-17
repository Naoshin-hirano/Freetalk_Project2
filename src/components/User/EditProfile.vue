<template>
  <v-row justify="center" >
    <v-dialog v-model="editDialog" persistent width="400px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          fab accent
          text>
           <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <v-card>
         <v-container>
             <v-layout row wrap>
                 <v-flex xs12>
                     <v-card-title>{{$t('edit_profile')}}</v-card-title>
                 </v-flex>
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-flex xs12>
                     <v-card-text>
                        <v-text-field
                            name="userName"
                            :label="$t('user_name')"
                            id="userName"
                            v-model="userName"
                            required>
                        </v-text-field>
                        <v-textarea
                            name="introduction"
                            :label="$t('introduction')"
                            id="introduction"
                            v-model="introduction"
                            required>
                        </v-textarea>
                     </v-card-text>
                     <v-card-text>
                         <v-text-field
                            :label="$t('chose_icon')"
                            @click="pickFile"
                            v-model="imageName"
                            >
                        </v-text-field>
                        <input 
                            type="file"
                            style="display : none"
                            ref="image"
                            accept="image/*"
                            @change="onFilePicked">
                        <v-avatar size="150" >
                            <img v-if="photoURL" :src="photoURL">
                            <img v-else src="@/assets/anonymous.jpg">
                        </v-avatar>
                     </v-card-text>
                 </v-flex>
             </v-layout>
             <v-divider></v-divider>
             <v-layout>
                 <v-flex>
                     <v-card-actions>
                         <v-btn @click="close" text class="red--text darken-1">
                           {{$t('close')}} 
                         </v-btn>
                         <v-btn @click="onSaveProfile" text class="green--text darken-1">
                           {{$t('save')}} 
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
  import firebase from "firebase/app"
  import 'firebase/auth'
  import 'firebase/storage'
  import 'firebase/database'
  export default {
    data () {
      return {
        //ダイアログ
        editDialog: false,
        //ログインユーザーの名前
        userName: this.$store.getters.userName ? this.$store.getters.userName : this.anonymous,
        //ログインユーザーのアイコン
        photoURL: this.$store.getters.photoURL,
        //ログインユーザーの自己紹介
        introduction: this.$store.getters.introduction,
        //画像アップロード
        imageName: "",
        imageFile: ""
      }
    },
    computed: {
      //匿名の多言語
    　anonymous(){
        if(this.$i18n.locale === 'ja'){
          return "名無し"
        }else if(this.$i18n.locale = 'en'){
          return "Anonymous"
        }
      }
    },
    methods: {
      //アップロードしたい画像をimgフォルダから選ぶ
      pickFile(){
        this.$refs.image.click()
      },
      //画像がstorageに保存＋URL画像が画面に表示
      onFilePicked(e){
        const files = e.target.files
        if(files[0] !== undefined){
          this.imageName = files[0].name
          if(this.imageName.lastIndexOf(".") <= 0){
            return
          }
          const fr = new FileReader()
          fr.readAsDataURL(files[0])
          fr.addEventListener("load", ()=>{
            this.photoURL = fr.result
            this.imageFile = files[0]
          })
        }else{
          this.imageName = ""
          this.imageFile = ""
          this.photoURL = ""
        }
      },
      //プロフィール情報を更新
      onSaveProfile(){
        firebase.database().ref("/users/" + this.$store.getters.user.id).update({
          displayName: this.userName,
          photoURL: this.photoURL,
          introduction: this.introduction
        })
        this.$store.dispatch("fetchUserData")
        this.editDialog = false
      },
      //プロフィール更新画面を閉じる
      close(){
        this.editDialog = false
        this.imageName = ""
        this.photoURL = this.$store.getters.photoURL
      },
    }
  }
</script>