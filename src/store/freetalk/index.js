import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/database'

export default {
  state: {
    loadedFreeTalks:[],
    attendance: [],
    //いいね機能
    favs: []
  },
  mutations: {
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
    }
  }
}
