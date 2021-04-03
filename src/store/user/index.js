import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/database'

export default {
  state: {
    user: null,
    otherUser: null
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
//ユーザー情報の取り出し
    fetchUserData({commit, getters}){
      commit("setLoading", true)
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
        commit("setLoading", false)
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
    }
  },
  getters: {
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
    }
  }
}
