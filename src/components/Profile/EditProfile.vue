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
                     <v-card-title>プロフィールの編集</v-card-title>
                 </v-flex>
             </v-layout>
             <v-divider></v-divider>
             <v-layout row wrap>
                 <v-flex xs12>
                     <v-card-text>
                        <v-text-field
                            name="userName"
                            label="ユーザーネーム"
                            id="userName"
                            v-model="userName"
                            required>
                        </v-text-field>
                        <v-textarea
                            name="introduction"
                            label="自己紹介"
                            id="introduction"
                            v-model="introduction"
                            required>
                        </v-textarea>
                     </v-card-text>
                     <v-card-text>
                         <v-text-field
                            label="イメージを選ぶ"
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
                            <v-img :src="photoURL">
                            </v-img>
                        </v-avatar>
                     </v-card-text>
                 </v-flex>
             </v-layout>
             <v-divider></v-divider>
             <v-layout>
                 <v-flex>
                     <v-card-actions>
                         <v-btn @click="close" text class="blue--text darken-1">閉じる</v-btn>
                         <v-btn @click="onSaveProfile" text class="blue--text darken-1">保存する</v-btn>
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
        imageName: "",
        imageFile: ""
      }
    },
    methods: {
      pickFile(){
        this.$refs.image.click()
      },
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
      onSaveProfile(){
        this.$store.dispatch("updateProfile",{
          id: this.$store.getters.user.id,
          displayName: this.userName,
          photoURL: this.photoURL,
          image: this.imageFile,
          introduction: this.introduction
        })
        this.editDialog = false
      },
      close(){
        this.editDialog = false
        this.imageName = ""
        this.photoURL = this.$store.getters.photoURL
      },
    }
  }
</script>