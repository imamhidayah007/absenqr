import { route } from 'quasar/wrappers'
import {createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import { LocalStorage } from 'quasar'
import routes from './routes'


/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {
    const cek = () => {
      return LocalStorage.getItem('dataUser') === null || LocalStorage.getItem('dataUser') === 'undefined'
    }

    if (to.matched.some(record => record.meta.authAdmin)){
      if (cek()) {
        next({
          name: 'loginPage'
        })
      } else {
        const dataSession = LocalStorage.getItem('dataUser')
        if (dataSession.level === 'Admin' && dataSession.status_aktif === 'Aktif') {
          next()
        } else {
          next({
            name: 'disabled'
          })
        }
      }

    }else if (to.matched.some(record => record.meta.authScan)){
      if (cek()) {
        next({
          name: 'loginPage'
        })
      } else {
        const dataSession = LocalStorage.getItem('dataUser')
        if (dataSession.level === 'Admin' && dataSession.status_aktif === 'Aktif') {
          next()
        } else {
          next({
            name: 'disabled'
          })
        }
      }

    }else if (to.matched.some(record => record.meta.authTamu)){

      if (cek()) {
        next()
      }else{
        const dataSession = LocalStorage.getItem('dataUser')
        if (dataSession.level === 'Admin' && dataSession.status_aktif === 'Aktif') {
          next({
            name: 'dashboard'
          })
        }else {
          next({
            name: 'disabled'
          })
        }

      }

    }else if (to.matched.some(record => record.meta.authBlok)){
      if (cek()) {
        next({
          name: 'loginPage'
        })
      }else{

        const dataSession = LocalStorage.getItem('dataUser')
        if (dataSession.level === 'Admin' && dataSession.status_aktif === 'Aktif') {
          next({
            name: 'dashboard'
          })
        }else if (dataSession.level === 'Guru' && dataSession.status_aktif === 'Aktif') {
          next({
            name: 'dashboard'
          })
        }else if (dataSession.level === 'Siswa' && dataSession.status_aktif === 'Aktif') {
          next({
            name: 'dashboard'
          })
        }else {
          next({
            name: 'disabled'
          })
        }

      }
    }else if (to.matched.some(record => record.meta.authUmum)){

      if (cek()) {
        next({
          name: 'loginPage'
        })
      }else{

        const dataSession = LocalStorage.getItem('dataUser')
        if (dataSession.status_aktif === 'Aktif') {
          next()
        }else {
          next({
            name: 'disabled'
          })
        }

      }

    } if (to.matched.some(record => record.meta.authGuru)){
        if (cek()) {
          next({
            name: 'loginPage'
          })
        } else {
          const dataSession = LocalStorage.getItem('dataUser')
          if (dataSession.level === 'Guru' && dataSession.status_aktif === 'Aktif') {
            next()
          } else {
            next({
              name: 'disabled'
            })
          }
        }

    }if (to.matched.some(record => record.meta.authSiswa)){
      if (cek()) {
        next({
          name: 'loginPage'
        })
      } else {
        const dataSession = LocalStorage.getItem('dataUser')
        if (dataSession.level === 'Siswa' && dataSession.status_aktif === 'Aktif') {
          next()
        } else {
          next({
            name: 'disabled'
          })
        }
      }

    }else {
      next()
    }


  })


  return Router
})
