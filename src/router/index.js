import Vue from 'vue'
import Router from 'vue-router'
import HomeView from '@/pages/home/HomeView'
import Attendance from '@/pages/home/attendance/Attendance'
import ChangeShift from '@/pages/home/change-shift/ChangeShift'
import ExamNotice from '@/pages/home/exam/ExamNotice'
import ExamAnswer from '@/pages/home/exam/ExamAnswer'
import ExamExplain from '@/pages/home/exam/ExamExplain'
import ExamOver from '@/pages/home/exam/ExamOver'
import ExamExercise from '@/pages/home/exam/ExamExercise'
import ExamIndex from '@/pages/home/exam/ExamIndex'
import CertificationList from '@/pages/home/exam/certification/CertificationList'
import CertificationDetail from '@/pages/home/exam/certification/CertificationDetail'
import Leave from '@/pages/home/leave/Leave'
import OverTime from '@/pages/home/overtime/OverTime'
import Salary from '@/pages/home/salary/Salary'
import SignIn from '@/pages/home/sign-in/SignIn'
import TrainIndex from '@/pages/home/train/TrainIndex'
import Train from '@/pages/home/train/Train'
import CourseList from '@/pages/home/train/CourseList'
import VideoPaly from '@/pages/home/train/VideoPaly'
import Message from '@/pages/message/Message'
import Contacts from '@/pages/contacts/Contacts'
import PersonalCenter from '@/pages/personal-center/PersonalCenter'
import NotReadyView from '@/pages/not-ready/NotReadyView'
import storage from "@/assets/js/util/storage.js";//localStorage sessionStorage 存储

Vue.use(Router)


const router = new Router({
  mode:"history",
  base:"/oa/",  
  routes: [
  /*设置默为工作台*/
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
  },
  /*工作台*/
  {
    path:"/home",
    name:"HomeView",
    component:HomeView
  },
  /*工作台-考勤*/
  {
    path:"/attendance",
    name:"Attendance",
    component:Attendance
  },
  /*工作台-调班*/
  {
    path:"/change-shift",
    name:"ChangeShift",
    component:ChangeShift
  },
  /*工作台-考试-须知*/
  {
    path:"/exam-notice",
    name:"ExamNotice",
    component:ExamNotice
  },
  /*工作台-考试-答题*/
  {
    path:"/exam-answer",
    name:"ExamAnswer",
    component:ExamAnswer
  },
  /*工作台-考试-练习*/
  {
    path:"/exam-exercise",
    name:"ExamExercise",
    component:ExamExercise
  },
  /*工作台-考试-解析*/
  {
    path:"/exam-explain",
    name:"ExamExplain",
    component:ExamExplain
  },
  /*工作台-考试-结束*/
  {
    path:"/exam-over",
    name:"ExamOver",
    component:ExamOver
  },
  /*工作台-考试-证书详情*/
  {
    path:"/certification-detail",
    name:"CertificationDetail",
    component:CertificationDetail
  },
  /*工作台-考试-证书列表*/
  {
    path:"/certification-list",
    name:"CertificationList",
    component:CertificationList
  },
  /*工作台-考试-首页*/
  {
    path:"/exam-index",
    name:"ExamIndex",
    component:ExamIndex
  },
  /*工作台-请假*/
  {
    path:"/leave",
    name:"Leave",
    component:Leave
  },
  /*工作台-工作*/
  {
    path:"/overtime",
    name:"OverTime",
    component:OverTime
  },
  /*工作台-工资*/
  {
    path:"/salary",
    name:"Salary",
    component:Salary
  },
  /*工作台-补打卡*/
  {
    path:"/sign-in",
    name:"SignIn",
    component:SignIn
  },
  /*工作台-培训-首页*/
  {
    path:"/train-index",
    name:"TrainIndex",
    component:TrainIndex
    //component:Train
  },
  /*工作台-培训-课程列表*/
  {
    path:"/course-list",
    name:"CourseList",
    component:CourseList
  },
  /*工作台-培训-播放视频*/
  {
    path:"/video-paly",
    name:"VideoPaly",
    component:VideoPaly
  },
  /*消息*/
  {
    path:"/message",
    name:"Message",
    component:Message
  },
  /*通讯录*/
  {
    path:"/contacts",
    name:"Contacts",
    component:Contacts
  },
  /*个人中心*/
  {
    path:"/personal-center",
    name:"PersonalCenter",
    component:PersonalCenter
  },
  {
    path:"/notReady",
    name:"notReady",
    component:NotReadyView
  }
  ]
})
router.beforeEach((to, from, next) => {
  /*let authorization = storage.localStorage.getAuthorization ()
  if (!authorization && to.path !== '/login/login'&& to.path !== '/login/logout') {
    // alert('请重新登录')
   window.location.replace('/login/logout')
  } else {
    next()
  }*/
  next()
})
export default router
