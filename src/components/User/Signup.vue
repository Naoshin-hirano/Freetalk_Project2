<template>
    <v-container mt-5>
        <v-layout v-if="error">
            <v-flex xs12 sm8 offset-sm3>
                <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12 sm8 offset-sm3>
                <v-card>
                    <v-card-text>
                        <v-container>
                            <h1 class="mb-5">新規登録</h1>
                            <div class="mb-5">
                                <router-link to="/login" tag="span" style="cursor: pointer">ログインはこちら</router-link>
                            </div>
                            <v-divider class="mb-5"></v-divider>
                            <form @submit.prevent="onSignup">
                                <v-layout>
                                  <v-flex xs12>
                                      <v-text-field
                                      name="email"
                                      label="Mail"
                                      id="email"
                                      v-model="email"
                                      type="email"
                                      required></v-text-field>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                  <v-flex xs12>
                                      <v-text-field
                                      name="password"
                                      label="Password"
                                      id="password"
                                      v-model="password"
                                      type="password"
                                      required></v-text-field>
                                  </v-flex>
                                </v-layout>
                                <v-layout>
                                  <v-flex xs12>
                                      <v-text-field
                                      name="confirmPassword"
                                      label="ConfirmPassword"
                                      id="confirmPassword"
                                      v-model="confirmPassword"
                                      type="confirmPassword"
                                      required
                                      :rules="[comparePassword]"></v-text-field>
                                  </v-flex>
                                </v-layout>
                                <!-- <v-layout>
                                   <v-flex>
                                       <v-text-field
                                        label="Select Image"
                                        @click="pickFile"
                                        v-model="imageName"
                                        >
                                      </v-text-field>
                                      <input
                                        type="file"
                                        style="display: none"
                                        ref="image"
                                        accept="image/*"
                                        @change="onFilePicked"/>
                                      <v-avatar size="150" >
                                         <v-img :src="imageUrl">
                                         </v-img>
                                      </v-avatar>
                                   </v-flex>
                                </v-layout> -->
                                <v-layout>
                                    <v-flex class="mt-3">
                                        <v-btn type="submit" color="lime accent-4" style="width:100%;">
                                            続ける
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </form>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
// import firebase from "firebase"
export default {
  data(){
      return{
      email: "",
      password: "",
      confirmPassword: "",
      //Image Upload
      photo: null,
      photo_url: null,
      dialog: false,
      imageName: "",
      imageUrl: "",
      imageFile: ""
    }
  },
  computed: {
    comparePassword(){
      return this.password !== this.confirmPassword ? "Password do no match" : ""
    },
    user(){
      return this.$store.getters.user
    },
    error(){
      return this.$store.getters.error
    }
  },
  watch: {
    user(value){//signup成功したらホーム画面へ
      if(value !== null && value !== undefined){
        this.$route.push("/")
      }
    }
  },
  methods: {
    onSignup(){  
      this.$store.dispatch("signUserUp", {email: this.email, password: this.password})
      // this.upload()
    },
    onDismissed(){
      console.log("Dismissed Alert !")
      this.$store.dispatch("clearError")
    },
    //imageUpload
    // pickFile(){
    //   this.$refs.image.click()
    // },
    // onFilePicked(e){
    //   const files = e.target.files
    //   if(files[0] !== undefined){
    //     this.imageName = files[0].name
    //     if(this.imageName.lastIndexOf(".") <= 0){
    //       return 
    //     }
    //     const fr = new FileReader()
    //     fr.readAsDataURL(files[0])
    //     fr.addEventListener("load", ()=>{
    //       this.imageUrl = fr.result
    //       this.imageFile = files[0]
    //     })
    //   }else{
    //     this.imageName = ""
    //     this.imageFile = ""
    //     this.imageUrl = ""
    //   }
    // },
    //画像アップロード
    // upload(){
    //   firebase.storage().ref('freetalks/').put(this.imageFile).then(snapshot=>{
    //     snapshot.ref.getDownloadURL().then(downloadURL =>{
    //       this.imageUrl = downloadURL
    //       const user = firebase.auth().currentUser
    //       firebase.ref("/users/" + user.id).add(downloadURL)
    //     })
    //   })
    // }
  }
}
</script>

