import { boot } from 'quasar/wrappers'
import axios from 'axios'
import {QSpinnerTail} from "quasar";

 //const baseURL = 'http://localhost:2024/'
const baseURL = 'https://data.api.absenqr.com/'
//https://data.api.absenqr.com/api/
//const baseURL = 'http://192.168.43.181:2024/'

const axiosInstance = axios.create({ baseURL: `${baseURL}api` })

const loadingStyle = {
  spinner: QSpinnerTail,
  spinnerColor: 'blue',
  spinnerSize: 100,
  backgroundColor: 'white',
  message: 'Harap Tunggu...',
  messageColor: 'blue'
}


export default boot(({ app }) => {

  app.config.globalProperties.$axios = axiosInstance
  app.config.globalProperties.$baseImageProfil = `${baseURL}fotoprofil/`
  app.config.globalProperties.$baseAlbumSekolah = `${baseURL}albumsekolah/`
  app.config.globalProperties.$loadingStyle = loadingStyle

})

export { axios }
