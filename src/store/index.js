import Vue from "vue"
import Vuex from "vuex"
import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/database'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loadedFreeTalks:[],
    attendance: [],
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
    },
    deleteFollowing(state, payload){//paramsId(他ユーザ)
      const following = state.user.following
      following.splice(following.findIndex(uid => uid === payload), 1)
      Reflect.deleteProperty(state.user.followingKeys, payload)
      console.log("following削除")
    },
    followers(state, payload){//payload.id:getters.user.id
      const id = payload.id
      if(state.otherUser.followers.findIndex(user => user.id === id)>=0){
        return
      }
      state.otherUser.followers.push(id)
      state.otherUser.followerKeys[id] = payload.followerKey
    },
    deleteFollowers(state, payload){//uid(他ユーザ)
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
    removeAttendance(state, payload){
      const attend= state.attendance.findIndex(attend =>{
        return attend.attendKey === payload.attendKey
      })
      state.attendance.splice(attend, 1)
    },
    setAttendance(state, payload){
      state.attendance = payload
    },
//コメント機能の投稿・削除・取り出し
    createComment(state, payload){
      state.otherUser.comments.push(payload)
    },
    deleteComment(state, payload){//payload=commentId
      const comment = state.otherUser.comments.findIndex(comment =>{
        return comment.commentId === payload
      })
      state.otherUser.comments.splice(comment, 1)
    },
//リプライ機能の投稿・削除・取り出し
    createReply(state, payload){
      state.otherUser.replys.push(payload)
    },
    deleteReply(state, payload){
      const reply = state.otherUser.replys.findIndex(reply =>{
        return reply.replyId === payload//replyId
      })
      state.otherUser.replys.splice(reply, 1)
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
      const currentUser = firebase.auth().currentUser
      currentUser.updateProfile({
        photoURL: payload.image,
        displayName: payload.displayName
      })
       .then(()=>{
        firebase.database().ref("/users/" + user.id)
        .set(payload)
          commit("setLoginUser",{
           id: payload.id,
           photoURL: payload.photoURL,
           displayName: payload.displayName,
           introduction: payload.introduction,
           registeredFreetalks: [],
           fbKeys: {},
           //コメント機能
           comments: [],
           //リプライ機能
           replys: [],
           //フォロー機能（データ取り出し）
           following: [],
           followingKeys: {},
           followers: [],
           followersKeys: {}
        })
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
        //コメントのデータ
        const commentsObj = data.val().comments
        let comments = []
        let replys = []
        for(let key in commentsObj){
          comments.push({
            createrId: commentsObj[key].createrId,
            roomUserId: commentsObj[key].roomUserId,
            name: commentsObj[key].name,
            image: commentsObj[key].image,
            message: commentsObj[key].message,
            commentId: commentsObj[key].commentId,
            datetime: commentsObj[key].datetime,
            replys: commentsObj[key].replys
          })
          //リプライデータ
          const obj2 = commentsObj[key].replys
          for(let key2 in obj2){
            replys.push({
              replyId: obj2[key2].replyId,
              commentId: obj2[key2].commentId,
              roomUserId: obj2[key2].roomUserId,
              createrId: obj2[key2].createrId,
              message: obj2[key2].message,
              name: obj2[key2].name,
              image: obj2[key2].image,
              datetime: obj2[key2].datetime
            })
          }
        }

        const updateUser = {
          id: userData.id,
          photoURL: userData.photoURL,
          displayName: userData.displayName,
          introduction: userData.introduction,
          registeredFreetalks: registeredFreetalks,
          fbKeys: swappedPairs,
          comments: comments,
          replys: replys,
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
         //コメントのデータ
        const commentsObj = data.val().comments
        let comments = []
        let replys = []
        for(let key in commentsObj){
          comments.push({
            createrId: commentsObj[key].createrId,
            roomUserId: commentsObj[key].roomUserId,
            name: commentsObj[key].name,
            image: commentsObj[key].image,
            message: commentsObj[key].message,
            commentId: commentsObj[key].commentId,
            datetime: commentsObj[key].datetime,
            replys: commentsObj[key].replys
          })
          //リプライデータ
          const obj2 = commentsObj[key].replys
          for(let key2 in obj2){
            replys.push({
              replyId: obj2[key2].replyId,
              commentId: obj2[key2].commentId,
              roomUserId: obj2[key2].roomUserId,
              createrId: obj2[key2].createrId,
              message: obj2[key2].message,
              name: obj2[key2].name,
              image: obj2[key2].image,
              datetime: obj2[key2].datetime
            })
          }
        }
        

         const updateUser = {
           id: userData.id,
           photoURL: userData.photoURL,
           displayName: userData.displayName,
           introduction: userData.introduction,
           registeredFreetalks: registeredFreetalks,
           fbKeys: swappedPairs,
           comments: comments,
           replys: replys,
           following: registeredFollowing,
           followingKeys: followingKey,
           followers: registeredFollowers,
           followerKeys: followerKey
         }
         commit("setLoginOtherUser", updateUser)
       })
    },
//ゲストユーザーログイン
 loginWithGestUser({commit}, payload){
      commit("clearError")
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const guestUser = {
            id: user.uid,
            registeredFreetalks: [],
            fbKeys: {},
            //コメント機能
            comments: [],
              //リプライ機能
              replys: [],
            //フォロー機能（データ取り出し）
            following: [],
            followingKeys: {},
            followers: [],
            followersKeys: {}
            }   
            commit("setLoginUser", guestUser)
          })
        .catch(
          error =>{
            commit("setError", error)
            console.log(error)
          })
    },
//googleログイン・ログアウト
    loginWithGoogle({commit}){
      commit("setLoading", true)
      const google_auth_provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(google_auth_provider)
      commit("setLoading", false)
    },
    logout({commit}){
      firebase.auth().signOut()
      .then(() =>{
        commit("deleteLoginUser")
        console.log("signOut成功")
      })
      .catch(error =>{
        console.log(error)
      })
   },
//googleユーザーセット・削除
    setLoginUser({commit}, payload){
      commit("setLoading", true)
      commit("setLoginUser", {
        id: payload.uid,
        photoURL: payload.photoURL,
        displayName: payload.displayName,
        introduction: payload.introduction,
        registeredFreetalks: [],
        fbKeys: {},
        //コメント機能
        comments: [],
         //リプライ機能
         replys: [],
        //フォロー機能（データ取り出し）
        following: [],
        followingKeys: {},
        followers: [],
        followersKeys: {}
      })
      commit("setLoading", false)
    },
    deleteLoginUser({commit}){
      commit("deleteLoginUser")
    },
//facebookログイン
    loginWithFacebook(){
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
            //コメント機能
            comments: [],
             //リプライ機能
             replys: [],
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
   signUserInWithEmail({commit}, payload){
      commit("clearError")
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
       .then(
         user => {
           const newUser = {
            id: user.uid,
            registeredFreetalks: [],
            fbKeys: {},
            //コメント機能
            comments: [],
             //リプライ機能
             replys: [],
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
    deleteUserAccount({commit}){
      const user = firebase.auth().currentUser
      user.delete().then(()=>{
         console.log("Authからユーザー削除")
         firebase.database().ref("/users/" + user.uid).remove()
         console.log("データベースからユーザー削除")
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
      commit("setLoading", true)
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
          commit("setLoading", false)
        })
       .catch( error =>{
         commit("setLoading", false)
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
             favs: obj[key].favs,
             attendance: obj[key].attendance
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
        commit("deleteFollowers", user.id)
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
      let attendKey
      firebase.database().ref("/freetalks/" + payload.freetalkId).child("attendance").push(attendData)
       .then((data) =>{
         attendKey = data.key
         return firebase.database().ref("/freetalks/" + payload.freetalkId).child("/attendance/" + attendKey).update({attendKey: data.key})
       })
       .then(() =>{
        commit("registerAttendance", {
          ...attendData,
          attendKey: attendKey
         })
       })
       .catch(error =>{
         console.log(error)
       })
    },
    removeAttendance({commit}, payload){
      firebase.database().ref("/freetalks/" + payload.freetalkId).child("/attendance/" + payload.attendKey).remove()
       .then(() =>{
         commit("removeAttendance", payload)
       })
       .catch(error =>{
         console.log(error)
       })
    },
    loadedAttendance({commit}){
      commit("setLoading", true)
      firebase.database().ref("freetalks").once("value")
       .then((data) =>{
         const freetalks = []
         const atteddance = []
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
             favs: obj[key].favs,
             attendance: obj[key].attendance
           })
           const obj2 = obj[key].attendance
           for(let key2 in obj2){
            atteddance.push({
              uid: obj2[key2].uid,
              userName: obj2[key2].userName,
              photoURL: obj2[key2].photoURL,
              freetalkId: obj2[key2].freetalkId,
              datetime: obj2[key2].datetime
            })
           }
         }
         commit("setAttendance", atteddance)
         commit("setLoading", false)
       })
       .catch((error)=>{
         commit("setLoading", false)
         console.log(error)
       })
    },
//コメント機能の投稿・削除・取り出し
    createComment({commit}, payload){
      const commentData = {
        roomUserId: payload.roomUserId,
        createrId: payload.createrId,
        name: payload.name,
        message: payload.message,
        image: payload.image,
        datetime: payload.datetime,
        replys: {}
      }
      let commentId
      firebase.database().ref("/users/" + payload.roomUserId).child("/comments/").push(commentData)
       .then((data) =>{
         commentId = data.key
         return firebase.database().ref("/users/" + payload.roomUserId).child("/comments/" + commentId).update({ commentId: data.key})
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
    deleteComment({commit, getters}, payload){
      firebase.database().ref("/users/" + getters.otherUser.id).child("/comments/" + payload).remove()
       .then(() =>{
         commit("deleteComment", payload)
       })
       .catch(error =>{
         console.log(error)
       })
     },
//リプライ機能の投稿・削除・取り出し
    createReply({commit}, payload){//commentId
      const replyData = {
        commentId: payload.commentId,
        roomUserId: payload.roomUserId,
        createrId: payload.createrId,
        message: payload.message,
        name: payload.name,
        image: payload.image,
        datetime: payload.datetime
      }
      let replyId
      firebase.database().ref("/users/" + payload.roomUserId).child("/comments/" + payload.commentId).child("/replys/").push(replyData)
       .then((data) =>{
        replyId = data.key
        return firebase.database().ref("/users/" + payload.roomUserId).child("/comments/" + payload.commentId).child("/replys/" + replyId).update({ replyId: data.key})
       })
       .then(()=>{
         commit("createReply", {
           ...replyData,
           replyId: replyId
         })
       })
       .catch(error =>{
         console.log(error)
       })
    },
    deleteReply({commit, getters}, payload){
      firebase.database().ref("/users/" + getters.otherUser.id).child("/comments/" + payload.commentId).child("/replys/" + payload.replyId).remove()
       .then(() =>{
         commit("deleteReply", payload.replyId)
       })
       .catch(error =>{
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
