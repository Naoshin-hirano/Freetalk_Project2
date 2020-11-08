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
      comments:[],
      user: null,
      error: null,
      loading: false

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
      const uid = payload.userId
      if(state.user.likes.find(user => user.userId === uid)>=0){
        return
      }
      state.user.likes.push(uid)
      state.user.likeKeys[uid] = payload.likeKey
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
    setLoadedComments(state, payload){
      state.comments = payload
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
    createChat(state, payload){
      state.comments.push(payload)
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
    //likes登録//postLikesにIDないとそれぞれに送られない
    likesForFreetalk({commit,getters}, payload){//payload:freetalkId
      const user = getters.user
      firebase.database().ref("users" + user.id).child("likes")
       .push(payload)
       .then(data=>{
         commit("likesForFreetalk", {userId: payload, likeKey: data.key})
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
        likeKeys: {}
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
         const likePairs = data.val().likes
         let registeredFreetalks = []
         let swappedPairs = {}
         let likes = []
         let swappedLikePairs = {}
         for(let key in dataPairs){
           registeredFreetalks.push(dataPairs[key])
           swappedPairs[dataPairs[key]] = key
         }
         for(let key in likePairs){
           likes.push(likePairs[key])
           swappedLikePairs[likePairs[key]] = key
         }
         const updateUser = {
          id: userData.id,
          photoURL: userData.photoURL,
          displayName: userData.displayName,
          introduction: userData.introduction,
          registeredFreetalks: registeredFreetalks,
          fbKeys: swappedPairs,
          likes: likes,
          likeKey: swappedLikePairs
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
    loadedComments({commit}){
      firebase.database().ref("/comments/").once("value")
       .then(data=>{
         const comments = []
         const obj = data.val()
         for(let key in obj){
           comments.push({
             roomUserId: obj[key].roomUserId,
             name: obj[key].name,
             image: obj[key].image,
             message: obj[key].message
           })
         }
         commit("setLoadedComments", comments)
       })
        .catch((error)=>{
          console.log(error)
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
    createChat({commit}, payload){
      const chatData = {
        roomUserId: payload.id,
        name: payload.name,
        message: payload.message,
        image: payload.image
      }
      firebase.database().ref("/comments/").push(chatData)
       .then(()=>{
         commit('createChat',chatData)
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
    deleteUserAccount({getters,commit}){
      var ref = firebase.database().ref("freetalks")
        ref.orderByChild("createrId").equalTo(getters.user.id).on('child_added',(snapshot)=>{
        snapshot.ref.remove()
      })
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
          likeKeys: {}
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
      likeKeys: {}
    })
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
    // loadedComments(state){
    //  return (createrId)=>{
    //    return state.comments.filter((comment)=>{
    //      return comment.createrId === createrId
    //    })
    //  }
    // },
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
