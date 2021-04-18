import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/database'

export default {
  state: {
    //投稿されたFREETALK
    loadedFreeTalks:[],
    //出席者登録機能
    attendance: [],
    //いいね機能
    favs: []
  },
  mutations: {
//いいね機能の投稿・削除・取り出し
    createFavs(state, payload){
      const id = payload.freetalkId
      const uid = payload.uid
      if(state.favs.findIndex(fav =>fav.freetalkId === id && fav.uid === uid)>=0){
        return
      }
      console.log("お気に入り登録")
      state.favs.push(payload)
    },
    deleteFavs(state, payload){
      const fav = state.favs.findIndex(fav =>{
        return fav.freetalkId === payload.freetalkId && fav.uid === payload.uid
      })
      state.favs.splice(fav, 1)
      console.log("お気に入り解除")
    },
    setLoadedFavs(state, payload){
      state.favs = payload
    },
//Freetalkの投稿・削除・取り出し・編集
    createTalk(state, payload){
      state.loadedFreeTalks.push(payload)
      console.log("FREETALKを投稿しました")
    },
    deleteTalk(state, payload){
      const freetalk = state.loadedFreeTalks.findIndex(freetalk =>{
        return freetalk.id === payload.id
      })
      state.loadedFreeTalks.splice(freetalk, 1)
      console.log("FREETALKを削除しました")
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
      console.log("FREETALKを更新しました")
    },
//Attendanceの投稿・削除・取り出し
    registerAttendance(state, payload){
      state.attendance.push(payload)
      console.log("出席登録を完了")
    },
    removeAttendance(state, payload){
      const attendance = state.attendance.findIndex(attend =>{
        return attend.freetalkId === payload.freetalkId && attend.uid === payload.uid
      })
      state.attendance.splice(attendance, 1)
      console.log("出席登録を解除")
    },
    setAttendance(state, payload){
      state.attendance = payload
    },
  },
  actions: {
//Freetalkの投稿・削除・取り出し・編集
    createTalk({commit, getters}, payload){
      const freetalk = {
        language: payload.language,
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        createrId: getters.user.id,
        createrName: getters.user.displayName,
        photoURL: getters.photoURL,
        favs: [],
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
    deleteTalk({getters,commit}, payload){
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
         const favs = []
         const attendance = []
         const obj = data.val()
         //freetalksのループ
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
             createrName: obj[key].createrName,
             photoURL: obj[key].photoURL,
             favs: obj[key].favs,
             attendance: obj[key].attendance
           })
           //お気に入りのループ
           const obj2 = obj[key].favs
           for(let key2 in obj2){
             favs.push({
               uid: key2,
               freetalkId: obj2[key2]
             })
           }
           //出席登録のループ
           const obj3 = obj[key].attendance
           for(let key3 in obj3){
            attendance.push({
              uid: obj3[key3].uid,
              userName: obj3[key3].userName,
              photoURL: obj3[key3].photoURL,
              freetalkId: obj3[key3].freetalkId,
              datetime: obj3[key3].datetime,
              attendKey: obj3[key3].attendKey
            })
           }
         }
         commit("setLoadedFreetalks", freetalks)
         commit("setLoadedFavs", favs)
         commit("setAttendance", attendance)
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

//いいね機能の投稿・削除
    createFavs({commit}, payload ){
      firebase.database().ref("/freetalks/" + payload.freetalkId).child("/favs/").update({[payload.uid]: payload.freetalkId})
      commit("createFavs", { 
        freetalkId: payload.freetalkId, 
        uid: payload.uid 
      })
    },
    deleteFavs({commit}, payload){
    firebase.database().ref("/freetalks/" + payload.freetalkId).child("/favs/" + payload.uid).remove()
    .then(() =>{
      commit("deleteFavs", {
        freetalkId: payload.freetalkId,
        uid: payload.uid
      })
    })
    .catch(error =>{
      console.log(error)
      })
    },
//Attendanceの投稿・削除
    registerAttendance({commit}, payload){
      commit("setLoading", true)
      const attendData = {
        uid: payload.uid,
        userName: payload.userName,
        photoURL: payload.photoURL,
        freetalkId: payload.freetalkId,
        datetime: payload.datetime,
        attendKey:""
      }
      let key
      firebase.database().ref("/freetalks/" + payload.freetalkId).child("attendance").push(attendData)
       .then((data) =>{
         key = data.key
         firebase.database().ref("/freetalks/" + payload.freetalkId).child("/attendance/" + key).update({attendKey: key})
       })
       .then(() =>{
        commit("registerAttendance", {
          ...attendData
         })
         commit("setLoading", false)
       })
       .catch(error =>{
         console.log(error)
       })
    },
    removeAttendance({commit}, payload){
      commit("setLoading", true)
      firebase.database().ref("/freetalks/" + payload.freetalkId).child("/attendance/" + payload.attendKey).remove()
       .then(()=>{
        commit("removeAttendance", {
          attendKey: payload.attendKey,
          freetalkId: payload.freetalkId,
          uid: payload.uid
        })
        commit("setLoading", false)
       })
       .catch(error =>{
        console.log(error)
      })
    }
  },
  getters: {
    //FREETALKを日付順に並べる
    loadedFreeTalks (state){
      return state.loadedFreeTalks.sort((freetalkA, freetalkB)=>{
        return freetalkA.date > freetalkB.date
      })
    },
    //日付順にしたものを５つに絞る
    featuredFreeTalk(getters){
      return getters.loadedFreeTalks.slice(0, 5)
    },
    //投稿されたFREETALKから遷移したFREETALKを抽出
    loadedFreeTalk(state){
      return (freetalkId)=>{
        return state.loadedFreeTalks.find((freetalk)=>{
           return freetalk.id === freetalkId//1つ見つける
        })
      }
    },
   //お気に入りのデータ
   favs(state){
     return state.favs
   },
   //出席者のデータ
    attendance(state){
     return state.attendance
    }
  }
}
