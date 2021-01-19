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
      attendance: [],
      comments: [],
      replys: [],
      user: null,
      error: null,
      loading: false,
      //いいね機能
      myfavs: [],
      //フォロー機能
      status: false,
      detail_user: {},
      myfollows_users: [],
      myfollowers_users: []
  },
  mutations: {
    //フォロー機能
    onAuthStatusChanged(state, status) {
      state.status = status
    },
    get(state, user) {
      state.detail_user = user
    },
    following(state, {detail_user, user}) {
      firebase.database().ref('follows').push({
        following_id: user.uid,//OK
        follwed_id: detail_user.user_id//NG
      })
      .then(() => {
        state.myfollows_users.push(user.uid)
        state.myfollowers_users.push(detail_user.user_id)
        console.log('フォロー完了')
      })
      .catch(err => {
        console.log(err)
      })
    },
    remove_follow(state, {detail_user, user}) {
      firebase.database().ref('follows').orderByChild('following_id').equalTo(user.uid).on("child_added", user=>{
        let h = user.ref
        h.id = user.ref.key
        if(h.follwed_id === detail_user.user_id){
          firebase.database().ref('follows').child(h.id).remove()
          .then(() => {
            let myfollows_user = state.myfollows_users.filter(user =>{
              return user.id !== h.id
            })
            state.myfollowers_users.splice(myfollows_user, 1)
            console.log('フォロー解除')
          })
          .catch(error =>{
            console.log(error)
          })
        }
      })
    },
    myfollows(state, users) {
      state.myfollows_users = users
    },
    myfollowers(state, users) {
      state.myfollowers_users = users
    },
    //いいね機能
    create(state, post){
     const user = firebase.auth().currentUser
       firebase.database().ref("favs").push({
        user_id: user.uid,
        post_id: post.id
      })
      .then(() => {
        console.log("お気に入り登録")
        state.myfavs.push(post)
      })
      .catch(error=>{
        console.log(error)
      })
    },
    delete(state, post){
      const ref = firebase.database().ref("favs")
      ref.orderByChild("post_id").equalTo(post.id).on("child_added", ele =>{
          let remove_good_post = ele.val()
          if(remove_good_post.post_id === post.id){
            firebase.database().ref("favs").child(ele.key).remove()
            .then(()=>{
              let fav = state.myfavs.find(fav => {
                return fav.id === remove_good_post.post_id
               })
               state.myfavs.splice(fav, 1)
            })
            .then(()=>{
              console.log("削除完了")
            })
            .catch(error =>{
              console.log(error)
            })
          }
      })
    },
    getfav(state, favs_post){
      state.myfavs = favs_post
    },
    //register mutation
    registerUserForFreetalk(state, payload){//payload{id: payload, fbKey: data.key}
      const id = payload.id
      if(state.user.registeredFreetalks.findIndex(freetalk => freetalk.id === id)>=0){
        return 
      }
      state.user.registeredFreetalks.push(id)
      state.user.fbKeys[id] = payload.fbKey
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
    setLoadedReplys(state, payload){
      state.replys = payload
    },
    setAttendance(state, payload){
      state.attendance = payload
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
    createTalk(state, payload){
      state.loadedFreeTalks.push(payload)
    },
    registerAttendance(state, payload){
      state.attendance.push(payload)
    },
    createChat(state, payload){
      state.comments.push(payload)
    },
    createReply(state, payload){
      state.replys.push(payload)
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
    },
    removeAttendance(state, payload){//freetalkId,uid
      const attend= state.attendance.findIndex(attend =>{
        return attend.freetalkId === payload.val().freetalkId && attend.uid ===payload.val().uid
      })
      // console.log(attend)
      state.attendance.splice(attend, 1)//ユーザーのフィルターがかかっていない
    },
    deleteComment(state, payload){//payload=paramsId
      const comment = state.comments.find(comment =>{
        return comment.commentId === payload
      })
      state.comments.splice(comment, 1)
    },
    deleteReply(state, payload){
      const reply = state.replys.find(reply =>{
        return reply.commentId === payload.commentId
      })
      state.replys.splice(reply, 1)
    }
  },
  actions: {
    //フォロー機能
    getUser({commit}, id) {
      firebase.database().ref('users').once("value")
       .then(users => {
        let obj_user = {}
        users.forEach(user => {
          let detail_user = user.val()
          detail_user.id = user.id
          if(detail_user.user_id === id) {
            Object.assign(obj_user, detail_user)
          }
        })
        commit('get', obj_user)
      })
    },
    follow({commit, state}, detail_user) {
      const user = firebase.auth().currentUser
      if(state.myfollows_users.length) {
        state.myfollows_users.forEach(ele => {
          if(detail_user.user_id !== ele.user_id ) {//detail_user
            commit('following', {detail_user: detail_user, user: user})
          } else {
            commit('remove_follow', {detail_user: detail_user, user: user})
          }
        })
      } else {
        commit('following', {detail_user: detail_user, user: user})
      } 
    },
    myfollows({commit}) {
      const user = firebase.auth().currentUser
      firebase.database().ref('follows').orderByChild('following_id').equalTo(user.uid).on("child_added", element => {
          let my_follows_users = []
          const record = element.val()
          firebase.database().ref("/users/" + record.follwed_id).once("value")
          .then(user =>{
            let obj_user = user.ref
            obj_user.id = user.ref.key
            my_follows_users.push(obj_user)
          })
        commit('myfollows', my_follows_users)
      })
    },
    myfollowers({commit}) {
      const user = firebase.auth().currentUser
      firebase.database().ref('follows').orderByChild('follwed_id').equalTo(user.uid).on("child_added", element => {
          let my_followers_users = []
          const record = element.val()
          firebase.database().ref("/users/" + record.following_id).once("value")
          .then(user =>{
            let obj_user = user.ref
            obj_user.id = user.ref.key
            my_followers_users.push(obj_user)
          })
        commit('myfollowers', my_followers_users)
      })
    },
    //いいね機能
    createFav({commit, state}, post){
      if(state.myfavs.length){
        state.myfavs.forEach(ele =>{
          // console.log("ele.id:" + ele.id)//OK
          // console.log("post.id:" + post.id)//OK
          if(ele.id !== post.id){
            commit("create", post)
          }else{
            commit("delete", post)
          }
        })
      }else{
        commit("create", post)
      }
    },
    getFavs({commit}){
      firebase.database().ref("favs").once("value")
       .then(snapshot =>{
        let get_favs = []
        snapshot.forEach(ele =>{
          let fav = ele.val()
          fav.id = ele.id
          const user = firebase.auth().currentUser
          if(fav.user_id === user.uid){
            firebase.database().ref("freetalks").child(fav.post_id).once("value")
             .then(snap =>{
              let fav_post = snap.val()
              fav_post.id = snap.val().id
              get_favs.push(fav_post)
            })
          }
        })
        commit("getfav", get_favs)
      })
      .catch(error =>{
        console.log(error)
      })
    },
    //register登録
     registerUserForFreetalk({commit,getters}, payload){//payload:freetalkId
      const user = getters.user
      firebase.database().ref("/users/" + user.id).child("/registrations/")
       .push(payload)
       .then(data=>{
         commit("registerUserForFreetalk", {id: payload, fbKey: data.key})
       })
       .catch(error=>{
         console.log(error)
       })
    },
    updateProfile({commit,getters}, payload){
      const user = getters.user
      firebase.database().ref("/users/" + user.id)
       .set(payload)
         commit("setLoginUser",{
          id: payload.id,
          photoURL: payload.photoURL,
          displayName: payload.displayName,
          introduction: payload.introduction,
          registeredFreetalks: [],
          fbKeys: {},
          likesKeys: {}
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
    //ユーザー情報を取り出す
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
             language: obj[key].language,
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
    loadedAttendance({commit}){
      firebase.database().ref("attendance").once("value")
       .then(data =>{
         const attendance = []
         const obj = data.val()
         for(let key in obj){
            attendance.push({
              uid: obj[key].uid,
              userName: obj[key].userName,
              photoURL: obj[key].photoURL,
              freetalkId: obj[key].freetalkId,
              datetime: obj[key].datetime
            })
          }
          commit("setAttendance", attendance)
       })
       .catch(error =>{
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
            message: obj[key].message,
            commentId: obj[key].commentId,
            datetime: obj[key].datetime,
            replys: obj[key].replys
           })
         }
         commit("setLoadedComments", comments)
       })
        .catch(error=>{
          console.log(error)
        })
    },
    loadedReplys({commit}){
      firebase.database().ref("/comments/").once("value")
       .then(data=>{
         const comments = []
         const replys = []
         const obj = data.val()
         for(let key in obj){
           comments.push({
            roomUserId: obj[key].roomUserId,
            name: obj[key].name,
            image: obj[key].image,
            message: obj[key].message,
            commentId: obj[key].commentId,
            datetime: obj[key].datetime,
            replys: obj[key].replys
           })
           const obj2 = obj[key].replys
           for(let key2 in obj2){//
             replys.push({
               commentId: obj2[key2].commentId,
               image: obj2[key2].image,
               name: obj2[key2].name,
               replymessage: obj2[key2].replymessage,
               replyuserid: obj2[key2].replyuserid
             })
           }//
         }
         commit("setLoadedReplys", replys)
       })
        .catch(error=>{
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
         })
       .catch(
         error => {
           commit("setError", error)
           console.log(error)
         })
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
         })
       .catch(
         error =>{
           commit("setError", error)
           console.log(error)
         })
    },
    logout(){
       firebase.auth().signOut()
       .then(() =>{
         console.log("signOut成功")
       })
       .catch(error =>{
         console.log(error)
       })
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
        language: payload.language,
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        createrId: getters.user.id,
        photoURL: getters.photoURL,
        id:""
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
          imageUrl = url
          console.log("imageUrlは")
          console.log(imageUrl)
          return firebase.database().ref('freetalks/').child(key).update({ imageUrl: url })
        })
        .then(()=>{
          firebase.database().ref('freetalks/').child(key).update({id: key})
        })
        .then(() => {
          commit('createTalk', {
            ...freetalk,
            id: key,
            imageUrl: imageUrl
          })
        })
       .catch( error =>{
         console.log(error)
       })
    },
    registerAttendance({commit}, payload){//payload:user.id,id
      const attendData = {
        uid: payload.uid,
        userName: payload.userName,
        photoURL: payload.photoURL,
        freetalkId: payload.freetalkId,
        datetime: payload.datetime
      }
      firebase.database().ref("attendance").push(attendData)
       .then(() =>{
        commit("registerAttendance", {
          ...attendData
         })
       })
       .catch(error =>{
         console.log(error)
       })
    },
    removeAttendance({commit,getters}, payload){
       const attendRef = firebase.database().ref("attendance")
       attendRef.orderByChild("uid").equalTo(getters.user.id).on("child_added", (snap) =>{
         if(snap.val().freetalkId === payload.freetalkId){
           snap.ref.remove()//
           commit("removeAttendance", snap)
         }
       })
    },
    createChat({commit}, payload){
      const chatData = {
        roomUserId: payload.id,
        name: payload.name,
        message: payload.message,
        image: payload.image,
        datetime: payload.datetime,
        commentId: "",
        replys: {}
      }
      let key
      firebase.database().ref("/comments/").push(chatData)
       .then((data) =>{
         key = data.key
         return firebase.database().ref("/comments/").child(key).update({ commentId: key})
       })
       .then(() =>{
         commit("createChat", {
          roomUserId: payload.id,
          name: payload.name,
          message: payload.message,
          image: payload.image,
          datetime: payload.datetime,
          commentId: key,
          replys: {}
         })
       })
       .catch(error=>{
         console.log(error)
       })
    },
    createReply({commit}, payload){
      const replyData = {
        image: payload.image,
        replymessage: payload.replymessage,
        name: payload.name,
        replyuserid: payload.replyuserid,
        commentId: payload.commentId
      }
      firebase.database().ref("/comments/" + payload.commentId).child("/replys/").push(replyData)
       .then(()=>{
         commit("createReply", replyData)
       })
       .catch(error =>{
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
      }
    },
    deleteComment({commit}, payload){//paramsId
     firebase.database().ref("comments").child(payload).remove()
      .then(() =>{
        commit("deleteComment", payload)
      })
    },
    deleteReply({commit}, payload){
      const ref = firebase.database().ref("replys")
      ref.orderByChild("commentId").equalTo(payload.commentId).on("child_added", snapshot =>{
        snapshot.ref.remove()
        commit("deleteReply", snapshot)
        console.log("deleteReply done")
      })
    },
    deleteUserAccount({getters,commit}){
     const ref = firebase.database().ref("freetalks")
     ref.orderByChild("createrId").equalTo(getters.user.id).on("child_added", (snapshot)=>{
       snapshot.ref.remove()
       console.log("同ユーザーのFreetalkも削除")
     })
      .then(()=>{
        firebase.auth().currentUser.delete()
        console.log("Authからユーザー削除")
      })
      .then(()=>{
        firebase.database().ref("/users/" + getters.user.id).remove()
        console.log("データベースからユーザー削除")
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
    favFilter(state){
      return (freetalkId)=>{
        return state.myfavs.filter((post) =>{
          return post.id === freetalkId
        })
      }
    },
    filterAttendance(state){
      return (freetalkId)=>{
        return state.attendance.filter((data) =>{
          return data.freetalkId === freetalkId
        })
      }
    },
    attendance(state){
     return state.attendance
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
