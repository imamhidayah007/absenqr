
const routes = [
  {
    path: '/auth/',
    component: () => import('layouts/LoginRegisLayout.vue'),
    meta: { authTamu: true },
    children: [
      //{ path: 'loginx', name: 'loginPagex', component: () => import('pages/Login.vue')},
      { path: 'login', name: 'loginPage', component: () => import('pages/Login.vue')},
      { path: 'help', name: 'help', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/admin/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { authAdmin: true },
    children: [

      { path: 'presensi/jadwalmengajar', name:'jadwalmengajar', component: () => import('pages/Konten/Presensi/JadwalMengajar.vue') },
      { path: 'presensi/rekappresensi', name:'rekappresensi', component: () => import('pages/Konten/Presensi/RekapPresensi.vue') },
      { path: 'presensi/rekapkehadiransiswa/:id/:data', name:'rekapkehadiransiswa', component: () => import('pages/Konten/Presensi/RekapKehadiranSiswa.vue') },
      { path: 'presensi/rekapkehadiransiswa/detail/:id/:namasiswa', name:'detailabsen', component: () => import('pages/Guru/RicianDetailAbsen.vue') },
      { path: 'presensi/rekapkehadiranguru', name:'rekababsenguru', component: () => import('pages/Konten/Presensi/RekapPresensiGuru.vue') },
      { path: 'presensi/rekapkehadiranguru/detail/:id/:namaguru', name:'detail_rekababsenguru', component: () => import('pages/Konten/Presensi/GuruRicianDetailAbsen.vue') },
      { path: 'presensi/settingjam', name:'settingjam', component: () => import('pages/Konten/Presensi/SettingJam.vue') },


      { path: 'master/sekolah', name:'mastersekolah', component: () => import('pages/Konten/Master/MasterSekolah.vue') },
      { path: 'master/gurudanstaff', name:'gurustaff', component: () => import('pages/Konten/Master/GuruStaff.vue') },
      { path: 'master/detailgurudanstaff/:id', name:'detailguru', component: () => import('pages/Konten/Master/DetailGuru.vue') },
      { path: 'master/siswa', name:'siswa', component: () => import('pages/Konten/Master/DataSiswa.vue') },
      { path: 'master/detailsiswa/:id', name:'detailsiswa', component: () => import('pages/Konten/Master/DetailSiswa.vue') },

      { path: 'kurikulum/settingtahunajaran', name:'tahunajaran', component: () => import('pages/Konten/Kurikulum/SettingTA.vue') },
      { path: 'kurikulum/kelompokkelas', name:'kelompokkelas', component: () => import('pages/Konten/Kurikulum/KelompokKelas.vue') },
      { path: 'kurikulum/matapelajaran', name:'mapel', component: () => import('pages/Konten/Kurikulum/Mapel.vue') },
      { path: 'kurikulum/kelasberjalan', name:'kelasberjalan', component: () => import('pages/Konten/Kurikulum/KelasBerjalan.vue') },

      { path: 'kurikulum/kelasberjalan/jadwal/:id', name:'jadwal', component: () => import('pages/Konten/Kurikulum/Jadwal.vue') },
      { path: 'kurikulum/kelasberjalan/siswa/:id/:kelas/:status', name:'settsiswa', component: () => import('pages/Konten/Kurikulum/SettingSiswa.vue') },

      { path: 'master/users', name:'users', component: () => import('pages/Konten/Users.vue') },


    ]
  },
  {
    path: '/scan/',
    component: () => import('layouts/LoginRegisLayout.vue'),
    meta: { authScan: true },
    children: [
      { path: 'qr', name:'scanqr', component: () => import('pages/Konten/Presensi/ScanQR.vue') },
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { authUmum: true },
    children: [
      { path: '', name:'dashboard', component: () => import('pages/Index.vue') },
      { path: 'users/setting', name:'profile', component: () => import('pages/Konten/Profile.vue') },
    ]
  },
  {
    path: '/guru/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { authGuru: true },
    children: [

      { path: 'presensi/presensiharian', name:'guru_presensi_harian', component: () => import('pages/Guru/PresensiHarian.vue') },
      { path: 'presensi/jadwalmengajar', name:'guru_jadwalmengajar', component: () => import('pages/Guru/JadwalMengajar.vue') },
      { path: 'presensi/rekappresensi', name:'guru_rekappresensi', component: () => import('pages/Guru/RekapPresensi.vue') },
      { path: 'presensi/rekapkehadiransiswa/:id/:data/:mapel', name:'guru_rekapkehadiransiswa', component: () => import('pages/Guru/RekapKehadiranSiswa.vue') },
      { path: 'presensi/rekapkehadiransiswa/detail/:id/:namasiswa', name:'guru_detailabsen', component: () => import('pages/Guru/RicianDetailAbsen.vue') },
      { path: 'presensi/generate_qr', name:'guru_generateqr', component: () => import('pages/Siswa/GenerateQR.vue') },
    ]
  },
  {
    path: '/siswa/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { authSiswa: true },
    children: [

      { path: 'presensi/presensiharian', name:'siswa_presensi_harian', component: () => import('pages/Siswa/PresensiHarian.vue') },
      { path: 'presensi/jadwalpelajaran', name:'siswa_jadwalmengajar', component: () => import('pages/Siswa/JadwalPelajaran.vue') },
      { path: 'presensi/rekappresensi', name:'siswa_rekappresensi', component: () => import('pages/Siswa/RekapPresensi.vue') },
      { path: 'presensi/rekapkehadiransiswa', name:'siswa_rekapkehadiransiswa', component: () => import('pages/Siswa/RekapKehadiranSiswa.vue') },
      { path: 'presensi/generate_qr', name:'siswa_generateqr', component: () => import('pages/Siswa/GenerateQR.vue') },
      { path: 'presensi/rekapkehadiransiswa', name:'siswa_rekapkehadiransiswa', component: () => import('pages/Siswa/RekapKehadiranSiswa.vue') },

    ]
  },
  {
    path: '/disabled/',
    meta: { authBlok: true },
    component: () => import('layouts/LoginRegisLayout.vue'),
    children: [
      { path: '', name: 'disabled', component: () => import('pages/Blok.vue') },

    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
