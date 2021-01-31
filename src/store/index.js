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
      otherUser: null,
      error: null,
      loading: false,
      //いいね機能
      favs: []
  },
  mutations: {
//ユーザーフォロー機能の投稿・削除
    following(state, payload){//payload.id:paramsID
      const id = payload.id
      if(state.user.following.findIndex(user => user.id === id)>=0){
        return
      }
      state.user.following.push(id)
      state.user.followingKeys[id] = payload.followingKey
      console.log("followginのstateは")
      console.log(state.user.following)
    },
    followers(state, payload){//payload.id:getters.user.id
      const id = payload.id
      if(state.otherUser.followers.findIndex(user => user.id === id)>=0){
        return
      }
      state.otherUser.followers.push(id)
      state.otherUser.followerKeys[id] = payload.followerKey
      console.log("followersのstateは")
      console.log(state.otherUser.followers)
    },

    deleteFollowing(state, payload){//paramsId(他ユーザ)
      const following = state.user.following
      following.splice(following.findIndex(uid => uid === payload), 1)
      Reflect.deleteProperty(state.user.followingKeys, payload)
      console.log("following削除")
    },
    deleteFollowing(state, payload){//uid(他ユーザ)
      const followers = state.otherUser.followers
      followers.splice(followers.findIndex(uid => uid === payload), 1)
      Reflect.deleteProperty(state.otherUser.followerKeys, payload)
      console.log("followers削除")
    },

    //他ユーザーアカウントを参照
    setLoginOtherUser(state, payload){
      state.otherUser = payload
    },
//いいね機能の投稿・削除・取り出し
    createFavs(state, payload){
      const id = payload.freetalkId
      const uid = payload.uid
      if(state.favs.findIndex(fav => fav.freetalkId === id && fav.uid === uid)>=0){
        return
      }
      state.favs.push(payload)
    },
    deleteFavs(state, payload){//payload={freetalkId + favKey}
      const fav = state.favs.findIndex(fav =>{
        return fav.favKey === payload.favKey
      })
      state.favs.splice(fav, 1)
    },
    setLoadedFavs(state, payload){
      state.favs = payload
    },
//参加ボタンのtrue/false
    registerUserForFreetalk(state, payload){//payload{id: payload, fbKey: data.key}
      const id = payload.id
      if(state.user.registeredFreetalks.findIndex(freetalk => freetalk.id === id)>=0){
        return
      }
      state.user.registeredFreetalks.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    unregisterUserFromFreetalk(state, payload){//freetalkId
      const registeredFreetalks = state.user.registeredFreetalks
      registeredFreetalks.splice(registeredFreetalks.findIndex(freetalk=> freetalk.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
//Freetalkの投稿・削除・取り出し・編集
    createTalk(state, payload){
      state.loadedFreeTalks.push(payload)
    },
    deleteTalk(state, payload){//payload=id
      const freetalk = state.loadedFreeTalks.findIndex(freetalk =>{
        return freetalk.id === payload.id
      })
      state.loadedFreeTalks.splice(freetalk, 1)
    },
    setLoadedFreetalks(state, payload){
      state.loadedFreeTalks = payload
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
//Attendanceの投稿・削除・取り出し
    registerAttendance(state, payload){
      state.attendance.push(payload)
    },
    removeAttendance(state, payload){//freetalkId,uid
      const attend= state.attendance.findIndex(attend =>{
        return attend.freetalkId === payload.val().freetalkId && attend.uid ===payload.val().uid
      })
      // console.log(attend)
      state.attendance.splice(attend, 1)//ユーザーのフィルターがかかっていない
    },
    setAttendance(state, payload){
      state.attendance = payload
    },
//コメント機能の投稿・削除・取り出し
    createComment(state, payload){
      state.comments.push(payload)
    },
    setLoadedComments(state, payload){
      state.comments = payload
    },
    deleteComment(state, payload){//payload=paramsId
      const comment = state.comments.findIndex(comment =>{
        return comment.commentId === payload
      })
      state.comments.splice(comment, 1)
    },
//リプライ機能の投稿・削除・取り出し
    createReply(state, payload){
      state.replys.push(payload)
    },
    deleteReply(state, payload){
      const reply = state.replys.find(reply =>{
        return reply.commentId === payload.commentId
      })
      state.replys.splice(reply, 1)
    },
    setLoadedReplys(state, payload){
      state.replys = payload
    },
//ユーザーアカウントをログイン・ログアウト
    setLoginUser(state, payload){
      state.user = payload
    },
    deleteLoginUser(state){
      state.user = null
    },
    setLoading(state, payload){
      state.loading = payload
    },
//エラー画面を表示・削除
    setError(state, payload){
      state.error = payload
    },
    clearError(state){
      state.error = null
    }
  },
  actions: {
//参加ボタンのtrue/false
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
    unregisterUserFromFreetalk({commit, getters}, payload){//payload:freetalkId
      const user = getters.user
      if(!user.fbKeys){
        return 
      }
      const fbKey = user.fbKeys[payload]
      firebase.database().ref("/users/" + user.id + "/registrations/").child(fbKey)
       .remove()
       .then(()=>{
         commit("unregisterUserFromFreetalk", payload)
       })
       .catch(error=>{
         console.log(error)
       })
    },

//ユーザー情報の更新
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
          //フォロー機能（データ取り出し）
          following: [],
          followingKeys: {},
          followers: [],
          followersKeys: {}
       })
    },
//ユーザー情報の取り出し
    fetchUserData({commit, getters}){
      firebase.database().ref("/users/" + getters.user.id).once("value")
      .then(data =>{
        const userData = data.val()
        //参加登録のデータ
        const dataPairs = data.val().registrations
        let registeredFreetalks = []
        let swappedPairs = {}
        for(let key in dataPairs){
         registeredFreetalks.push(dataPairs[key])
         swappedPairs[dataPairs[key]] = key
       }
        //フォローのデータ
        const followingPairs = data.val().following
        let registeredFollowing = []
        let followingKey = {}
        for(let key in followingPairs){
          registeredFollowing.push(followingPairs[key])
          followingKey[followingPairs[key]] = key
        }
        //フォロワーのデータ
        const followerPairs = data.val().followers
        let registeredFollowers = []
        let followerKey = {}
        for(let key in followerPairs){
          registeredFollowers.push(followerPairs[key])
          followerKey[followerPairs[key]] = key
        }

        const updateUser = {
          id: userData.id,
          photoURL: userData.photoURL,
          displayName: userData.displayName,
          introduction: userData.introduction,
          registeredFreetalks: registeredFreetalks,
          fbKeys: swappedPairs,
          following: registeredFollowing,
          followingKeys: followingKey,
          followers: registeredFollowers,
          followerKeys: followerKey
        }
        commit("setLoginUser", updateUser)
       })
        .catch(error=>{
          console.log(error)
        })
    },
//自分が見ているユーザー情報の取り出し
    fetchOtherUserData({commit}, userParamsId){
      firebase.database().ref("/users/" + userParamsId).once("value")
       .then(data =>{
         const userData = data.val()
         //参加登録のデータ
         const dataPairs = data.val().registrations
         let registeredFreetalks = []
         let swappedPairs = {}
         for(let key in dataPairs){
          registeredFreetalks.push(dataPairs[key])
          swappedPairs[dataPairs[key]] = key
        }
         //フォローのデータ
         const followingPairs = data.val().following
         let registeredFollowing = []
         let followingKey = {}
         for(let key in followingPairs){
           registeredFollowing.push(followingPairs[key])
           followingKey[followingPairs[key]] = key
         }
         //フォロワーのデータ
         const followerPairs = data.val().followers
         let registeredFollowers = []
         let followerKey = {}
         for(let key in followerPairs){
           registeredFollowers.push(followerPairs[key])
           followerKey[followerPairs[key]] = key
         }

         const updateUser = {
           id: userData.id,
           photoURL: userData.photoURL,
           displayName: userData.displayName,
           introduction: userData.introduction,
           registeredFreetalks: registeredFreetalks,
           fbKeys: swappedPairs,
           following: registeredFollowing,
           followingKeys: followingKey,
           followers: registeredFollowers,
           followerKeys: followerKey
         }
         commit("setLoginOtherUser", updateUser)
       })
    },
//googleログイン・ログアウト
    login(){
      const google_auth_provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(google_auth_provider)
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
//googleユーザーセット・削除
    setLoginUser({commit}, payload){
      commit("setLoginUser", {
        id: payload.uid,
        photoURL: payload.photoURL,
        displayName: payload.displayName,
        introduction: payload.introduction,
        registeredFreetalks: [],
        fbKeys: {},
        //フォロー機能（データ取り出し）
        following: [],
        followingKeys: {},
        followers: [],
        followersKeys: {}
      })
    },
    deleteLoginUser({commit}){
      commit("deleteLoginUser")
    },
//facebookログイン
    loginF(){
      const provider = new firebase.auth.FacebookAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    },
//メールアドレスでユーザーアカウント登録
    signUserUp({commit}, payload){
      commit("clearError")
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
       .then(
         user => {
          const newUser = {
            id: user.uid,
            registeredFreetalks: [],
            fbKeys: {},
            //フォロー機能（データ取り出し）
            following: [],
            followingKeys: {},
            followers: [],
            followersKeys: {}
           }
           commit("setLoginUser", newUser)
         })
       .catch(
         error => {
           commit("setError", error)
           console.log(error)
         })
    },
//メールアドレスでログイン
    signUserIn({commit}, payload){
      commit("clearError")
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
       .then(
         user => {
           const newUser = {
            id: user.uid,
            registeredFreetalks: [],
            fbKeys: {},
            //フォロー機能（データ取り出し）
            following: [],
            followingKeys: {},
            followers: [],
            followersKeys: {}
           }   
           commit("setLoginUser", newUser)
         })
       .catch(
         error =>{
           commit("setError", error)
           console.log(error)
         })
    },
//ユーザーアカウント削除
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
//Freetalkの投稿・削除・取り出し・編集
    createTalk({commit, getters}, payload){
      const freetalk = {
        language: payload.language,
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        createrId: getters.user.id,
        photoURL: getters.photoURL,
        favs: {},
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
    deleteTalk({getters,commit}, payload){//payload=freetalk
      if(getters.user.id){
       firebase.database().ref("freetalks").child(payload.id).remove()
        .then(()=>{
          commit("deleteTalk", payload)
        })
      }
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
             photoURL: obj[key].photoURL,
             favs: obj[key].favs
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
//ユーザーフォロー機能の投稿・削除
    getFollowing({commit, getters}, payload){//params.id(クリックされる)
      firebase.database().ref("/users/" + getters.user.id).child("/following/").push(payload)
      .then(data =>{
        commit("following", {id: payload, followingKey: data.key})
      })
      .catch(error =>{
        console.log(error)
      })
    },
    deleteFollowing({commit, getters}, payload){//params.id(クリックされる)
      const user = getters.user
      if(!user.followingKeys){
        return 
      }
      const followingKey = user.followingKeys[payload]
      firebase.database().ref("/users/" + user.id + "/following/").child(followingKey)
      .remove()
      .then(() =>{
        commit("deleteFollowing", payload)
      })
      .catch(error =>{
        console.log(error)
      })
    },
    getFollowers({commit, getters}, payload){
      firebase.database().ref("/users/" + payload).child("/followers/").push(getters.user.id)
      .then(data =>{
        commit("followers", {id: getters.user.id, followerKey: data.key})
      })
      .catch(error =>{
        console.log(error)
      })
    },
    deleteFollowers({commit, getters}, payload){
      const otherUser = getters.otherUser
      const user = getters.user
      if(!otherUser.followerKeys){
        return 
      }
      const followerKey = otherUser.followerKeys[user.id]
      firebase.database().ref("/users/" + payload + "/followers/").child(followerKey)
      .remove()
      .then(() =>{
        commit("deleteFollowing", user.id)
      })
      .catch(error =>{
        console.log(error)
      })
    },
//いいね機能の投稿・削除・取り出し
    createFavs({commit}, payload){//payload={uid + freetalkId}
      const favData = {
        uid: payload.uid,
        freetalkId: payload.freetalkId
      }
      let favKey
      firebase.database().ref("/freetalks/" + payload.freetalkId).child("/favs/").push(favData)
       .then((data) =>{
         favKey = data.key
         return firebase.database().ref("/freetalks/" + payload.freetalkId).child("/favs/" + favKey).update({favKey: data.key})
       })
       .then(() =>{
         commit("createFavs", {
           ...favData,
           favKey: favKey
         })
       })
       .catch(error =>{
         console.log(error)
       })
    },
    deleteFavs({commit}, payload){//payload={uid + favKey + freetalkId}
      firebase.database().ref("/freetalks/" + payload.freetalkId).child("/favs/" + payload.favKey).remove()
       .then(() =>{
         commit("deleteFavs", payload)
       })
       .catch(error =>{
         console.log(error)
       })
    },
    loadedFav({commit}){
      firebase.database().ref("freetalks").once("value")
       .then((data) =>{
         const freetalks = []
         const favs = []
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
             photoURL: obj[key].photoURL,
             favs: obj[key].favs
           })
           const obj2 = obj[key].favs
           for(let key2 in obj2){
             favs.push({
               uid: obj2[key2].uid,
               freetalkId: obj2[key2].freetalkId,
               favKey: obj2[key2].favKey
             })
           }
         }
         commit("setLoadedFavs", favs)
       })
       .catch((error)=>{
         console.log(error)
       })
    },
//Attendanceの投稿・削除・取り出し
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
//コメント機能の投稿・削除・取り出し
    createComment({commit}, payload){
      const commentData = {
        roomUserId: payload.id,
        uid: payload.uid,
        name: payload.name,
        message: payload.message,
        image: payload.image,
        datetime: payload.datetime,
        replys: {}
      }
      let commentId
      firebase.database().ref("/comments/").push(commentData)
       .then((data) =>{
         commentId = data.key
         return firebase.database().ref("/comments/").child(commentId).update({ commentId: data.key})
       })
       .then(() =>{
         commit("createComment", {
           ...commentData,
           commentId: commentId
         })
       })
       .catch(error=>{
         console.log(error)
       })
    },
    deleteComment({commit}, payload){//paramsId
      firebase.database().ref("comments").child(payload).remove()
       .then(() =>{
         commit("deleteComment", payload)
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
            uid: obj[key].uid,
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
//リプライ機能の投稿・削除・取り出し
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
    deleteReply({commit}, payload){
      const ref = firebase.database().ref("replys")
      ref.orderByChild("commentId").equalTo(payload.commentId).on("child_added", snapshot =>{
        snapshot.ref.remove()
        commit("deleteReply", snapshot)
        console.log("deleteReply done")
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
   favs(state){
     return state.favs
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
    otherUser(state){
      return state.otherUser
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
