import Vue from "vue"
import Vuex from "vuex"
import firebase from "firebase"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loadedFreeTalks:
      [
        {imageUrl: "https://reloadvisor.org/wp-content/uploads/2019/10/NY-ReloAdvisor.org_.jpg", 
        id: "akdddgela22nad", 
        title: "FreeTalk in NewYork",
        date: "2017-09-29",
        location: "New York",
        description: "New York is Awesome !!"},
        {imageUrl: "https://yuuma7.com/wp-content/uploads/2017/01/sundown-paris-830x460.jpg", 
        id: "akdbbraa5ffggg", 
        title: "FreeTalk in Paris",
        date: "2017-10-20",
        location: "Paris",
        description: "Paris is Awesome !!"}
      ],
      user: null,
      error: null,
      loading: false,
      postLikes: []

  },
  mutations: {
    //register mutation
    registerUserForFreetalk(state, payload){//payload{id: payload, fbKey: data.key}
      const id = payload.id
      if(state.user.registeredFreetalks.findIndex(freetalk => freetalk.id === id)>=0){
        return 
      }
      state.user.registeredFreetalks.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    likesForFreetalk(state, payload){
      const id = payload.id
      if(state.postLikes.find(freetalk => freetalk.id === id)>=0){
        return
      }
      state.postLikes.user.push(id)
      state.postLikes.user.likesKeys[id] = payload.likesKey 
    },
    //unregister.mutation
    unregisterUserFromFreetalk(state, payload){
      const registeredFreetalks = state.user.registeredFreetalks
      registeredFreetalks.splice(registeredFreetalks.findIndex(freetalk=> freetalk.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
    //freetalks取り出し
    setLoadedFreetalks(state, payload){
      state.loadedFreeTalks = payload
    },
    setLoginUser(state, payload){
      state.user = payload
    },
    setLoading(state, payload){
      state.loading = payload
    },
    setError(state, payload){
      state.error = payload
    },
    clearError(state){
      state.error = null
    },
    deleteLoginUser(state){
      state.user = null
    },
    createTalk(state, payload){
      state.loadedFreeTalks.push(payload)
    },
    updateFreetalk(state, payload){
      const freetalk = state.loadedFreeTalks.find(freetalk =>{
        return freetalk.id === payload.id
      })
      if(payload.title){
        freetalk.title = payload.title
      }
      if(payload.description){
        freetalk.description = payload.description
      }
      if(payload.date){
        freetalk.date = payload.date
      }
    },
    deleteTalk(state, payload){//payload=id
      const freetalk = state.loadedFreeTalks.find(freetalk =>{
        return freetalk.id === payload.id
      })
      state.loadedFreeTalks.splice(freetalk, 1)
    }
  },
  actions: {
    //register登録
     registerUserForFreetalk({commit,getters}, payload){//payload:freetalkId
      const user = getters.user
      firebase.database().ref("/users/" + user.id).child("/registrations/")
       .push(payload)//unregisterとの違い：registrationをはじめて作成するからここでchild使う
       .then(data=>{
         //payload:freetalkId
         //fbKey:registrationId
         commit("registerUserForFreetalk", {id: payload, fbKey: data.key})
       })
       .catch(error=>{
         console.log(error)
       })
    },
    updateProfile({commit,getters}, payload){
      const userData = {
        id: payload.id,
        image: payload.image,
        photoURL: payload.photoURL,
        displayName: payload.displayName,
        introduction: payload.introduction,
        registeredFreetalks: [],
        fbKeys: {},
        likesKeys: {}
      }
      const user = getters.user
      firebase.database().ref("/users/" + user.id).set(userData)
       .then(()=>{
         return firebase.storage().ref('userImgs/' + user.id).put(payload.image)
       })
       .then(()=>{
         commit('setLoginUser',{
           ...userData,
         })
       })        
    },
    //likes登録//postLikesにIDないとそれぞれに送られない
    likesForFreetalk({commit,getters}, payload){//payload:freetalkId
      const user = getters.user
      firebase.database().ref("postLikes").child(user.id)
       .set(payload)
       .then(data=>{
         commit("likesForFreetalk", {id: payload, likesKey: data.key})
       })
       .catch(error=>{
         console.log(error)
       })
    },
    unregisterUserFromFreetalk({commit, getters}, payload){//payload:freetalkId
      const user = getters.user
      if(!user.fbKeys){
        return 
      }
      const fbKey = user.fbKeys[payload]
      //registerとの違い： registrationsがすでに存在しているのでchildがこの使われ方
      firebase.database().ref("/users/" + user.id + "/registrations/").child(fbKey)
       .remove()
       .then(()=>{
         commit("unregisterUserFromFreetalk", payload)
       })
       .catch(error=>{
         console.log(error)
       })
    },
    //Registerのユーザー情報を取り出す
    fetchUserData({commit, getters}){
      firebase.database().ref("/users/" + getters.user.id).once("value")
       .then(data=>{
         const userData = data.val()
         const dataPairs = data.val().registrations
         let registeredFreetalks = []
         let swappedPairs = {}
         for(let key in dataPairs){
           registeredFreetalks.push(dataPairs[key])
           swappedPairs[dataPairs[key]] = key
         }
         const updateUser = {
          id: userData.id,
          photoURL: userData.photoURL,
          displayName: userData.displayName,
          introduction: userData.introduction,
          registeredFreetalks: registeredFreetalks,
          fbKeys: swappedPairs
        }
        commit("setLoginUser", updateUser)
       })
        .catch(error=>{
          console.log(error)
        })
    },
    loadedFreeTalks({commit}){
      commit("setLoading", true)
      firebase.database().ref("freetalks").once("value")
       .then((data) =>{
         const freetalks = []
         const obj = data.val()
         for(let key in obj){
           freetalks.push({
             id: key,
             title: obj[key].title,
             description: obj[key].description,
             imageUrl: obj[key].imageUrl,
             location: obj[key].location,
             date: obj[key].date,
             createrId: obj[key].createrId,
             photoURL: obj[key].photoURL
           })
         }
         commit("setLoadedFreetalks", freetalks)
         commit("setLoading", false)
       })
       .catch((error)=>{
         commit("setLoading", false)
         console.log(error)
       })
    },
    //googleログイン
    login(){
      const google_auth_provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(google_auth_provider)
    },
    //facebookログイン
    loginF(){
      const provider = new firebase.auth.FacebookAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    },
    //signUp
    signUserUp({commit}, payload){
      commit("clearError")
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
       .then(
         user => {
          const newUser = {
            id: user.uid,
            registeredFreetalks: [],
            fbKeys: {},
            likesKeys: {}
           }
           commit("setLoginUser", newUser)
         }
       )
       .catch(
         error => {
           commit("setError", error)
           console.log(error)
         }
       )
    },
    //メールアドレスによるログイン
    signUserIn({commit}, payload){
      commit("clearError")
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
       .then(
         user => {
           const newUser = {
            id: user.uid,
            registeredFreetalks: [],
            fbKeys: {}
           }   
           commit("setLoginUser", newUser)
         }
       )
       .catch(
         error =>{
           commit("setError", error)
           console.log(error)
         }
       )
    },
    logout(){
       firebase.auth().signOut()
    },
    deleteLoginUser({commit}){
      commit("deleteLoginUser")
    },
    setLoginUser({commit}, payload){
      commit("setLoginUser", {
        id: payload.uid,
        photoURL: payload.photoURL,
        displayName: payload.displayName,
        introduction: payload.introduction,
        registeredFreetalks: [],
        fbKeys: {},
        likesKeys: {}
      })
    },    
    createTalk({commit, getters}, payload){
      const freetalk = {
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        createrId: getters.user.id,
        photoURL: getters.photoURL
      }
      let imageUrl
      let key
      firebase.database().ref('freetalks').push(freetalk)
        .then((data) => {
          key = data.key
          const filename = payload.image.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          return firebase.storage().ref('freetalks/' + key + '.' + ext).put(payload.image)
        })
        .then(uploadTaskSnapshot => {
          return uploadTaskSnapshot.ref.getDownloadURL()
        })
        .then(url=>{
          return firebase.database().ref('freetalks/').child(key).update({ imageUrl: url })
        })      
        .then(() => {
          commit('createTalk', {
            ...freetalk,
            imageUrl: imageUrl,
            id: key
          })
        })
       .catch( error =>{
         console.log(error)
       })
    },
    updateFreetalkData({commit}, payload){
      const updateObj = {}//引き渡されてきた1つ1つのデータ(titleなど)をオブジェクトにまとめる
      if(payload.title){
        updateObj.title = payload.title
      }
      if(payload.description){
        updateObj.description = payload.description
      }
      if(payload.date){
        updateObj.date = payload.date
      }
      firebase.database().ref("freetalks").child(payload.id).update(updateObj)
       .then(()=>{
         commit("updateFreetalk", payload)
       })
       .catch(error=>{
         console.log(error)
       })
    },
    deleteTalk({getters,commit}, payload){//payload=freetalk
      if(getters.user.id){
       firebase.database().ref("freetalks").child(payload.id).remove()
        .then(()=>{
          commit("deleteTalk", payload)
        })
        .catch(error=>{
          console.log(error)
        })
      }
    },
    //Userアカウント削除
    deleteUserAccount({commit, getters}){
      firebase.database().ref("freetalks").orderByChild("createrId").equalTo(getters.user.id).remove()
      console.log("アカウント作成のFreetalkも削除")
       .then(()=>{
        firebase.auth().currentUser.delete()
        console.log("Authからアカウント削除成功")
       })
       .then(()=>{ 
        firebase.database().ref("/users/" + getters.user.id).remove()
        console.log("データベースからアカウント削除成功")
       })
       .then(()=>{
         commit("deleteLoginUser")
       })
       .catch(error=>{
         console.log(error)
       })
    },
    clearError({commit}){
      commit("clearError")
    }
  },
  getters: {
    loadedFreeTalks (state){
      return state.loadedFreeTalks.sort((freetalkA, freetalkB)=>{
        return freetalkA.date > freetalkB.date
      })
    },
    featuredFreeTalk(getters){
      return getters.loadedFreeTalks.slice(0, 5)//日付順にしたものを５つに絞る
    },
    loadedFreeTalk(state){
      return (freetalkId)=>{
        return state.loadedFreeTalks.find((freetalk)=>{
           return freetalk.id === freetalkId//1つ見つける
        })
      }
    },
    user(state){
      return state.user
    },
    userName(state){
      return state.user ? state.user.displayName : ""
    },
    photoURL(state){
      return state.user ? state.user.photoURL : ""
    },
    introduction(state){
      return state.user ? state.user.introduction : ""
    },
    error(state){
      return state.error
    },
    loading(state){
      return state.loading
    }
  }
})
