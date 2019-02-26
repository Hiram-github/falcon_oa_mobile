<template>
  <div class="exam">
    <header>
      <base-header headerTitle="考试须知" returnName=""></base-header>
      <div class="header-info">
        <h3>{{examInfo.exam_name}}</h3>
        <current-time></current-time>
      </div>
    </header>
    <main class="main">
     <div class="guild">
      <header class="title">
        <h4>考试须知</h4> 
      </header>
      <div class="content">
        <p>{{examInfo.exam_description}}</p>
      </div>
    </div>
    <ul class="list">
      <li><h6>考试时长</h6><span><label>{{examInfo.exam_limited_time}}</label>分钟</span></li>
      <li><h6>合格标准</h6><span>满分<label>{{examInfo.exam_paper.total_score}}</label>分,<label>{{examInfo.pass_score}}</label>分及格</span></li>
      <li><h6>考试时间</h6><span><label>{{examInfo.exam_end_time|formatDate}}</label>前完成</span></li>
      <li><h6>题目数量</h6><span><label>{{examInfo.exam_paper.question_num}}</label>题</span></li>
    </ul>
  </main>
  <footer class="footer">
   <button v-if="isCanExam" @click="toExamAnswer()" class="btn">已了解，开始考试
   </button>
   <button v-else style="background:#dddddd" class="btn">{{noCanExamHint}}</button>
 </footer>
</div>
</template>
<script>
  import storage from "@/assets/js/util/storage.js";
  import BaseHeader from "@/components/common/BaseHeader";//公共头组件
  import CurrentTime from "./components/CurrentTime";//当前时间
  import variables from "@/assets/js/variables.js";//公共变量
  import {formatDateTime} from "@/assets/js/util/page-util.js";
  export default{
    name:"HomeView",
    components: {
      BaseHeader,
      CurrentTime
    },
    data(){
      return {
        examStatusEnum:variables.examStatus,//考试状态枚举
        personExamStatusEnum:variables.personExamStatus,//考生个人考试状态枚举
        page:1,
        pageSize:1,
        examInfo:{
          exam_paper:{}
        },
        isCanExam:false,//是否可以考试
        noCanExamHint:"",//不能考试提示
        timeFormatMnum:variables.dateType
      }
    },
    created () {
      const self=this
      let examId=self.$route.query.examId
      if(examId){//判断是否指定考试，没有指定取最新一条
        self.getExamDetails(examId).then(()=>{
          self.getExamStatus()
        })
      }else{
        self.getNewExamInfo().then(()=>{
          self.getExamStatus()
        })
      }
    },
    destroyed(){

    },
    methods:{
      /**
       *  @Description: 获取考试信息(取最新一条)
       *  @Author: ykl
       */
       getNewExamInfo(){
        const self=this
        let promise = new Promise(function(resolve, reject){
          let url = "exam/plan/list"
          let requestData = {
            page: self.page,
            page_size:self.pageSize,
            exam_status:self.examStatusEnum.ISSUE.flag+","+self.examStatusEnum.EXAM_IN_EXECUTE.flag,
            person_exam_status:self.personExamStatusEnum.NO_START_EXAM.flag+","+self.personExamStatusEnum.EXAM_IN_EXECUTE.flag,
          }
          self.$http.post(url, requestData).then(res => {
           if(res.data.instance.length!=0){
            self.examInfo=res.data.instance[0]
            storage.sessionStorage.setItem("examInfo",self.examInfo);
            resolve()
          }
        }).catch(err => {
         reject()
       })
      })
        return promise
      },
      /**
       *  @Description: 获取单场考试信息
       *  @Param: id 考试id
       *  @Author: ykl
       */
       getExamDetails(id){
        const self=this
        let promise = new Promise(function(resolve, reject){
          let url = "exam/plan/get"
          let requestData = {
            id:id
          }
          self.$http.post(url, requestData).then(res => {
            if(res.data.instance){
              self.examInfo=res.data.instance
              storage.sessionStorage.setItem("examInfo",self.examInfo);
              resolve()
            }
          }).catch(err => {
            reject()
          })
        })
        return promise
      },
      /**
       *  @Description: 获取考试状态
       *  @Author: ykl
       */
       getExamStatus(){
        const self=this
        let url = "exam/online/query_person_online_cache_status"
        let requestData = {
          exam_plan_id: self.examInfo.id,
          exam_paper_id: self.examInfo.exam_paper.id
        }
        self.$http.post(url, requestData).then(res => {
          if(res.code==200)
            self.isCanExam=true
          else
            self.noCanExamHint=res.message
        })
      },
      toExamAnswer(){
        const self=this
        self.$router.push({
         path: '/exam-answer',
         query: {
          examId: self.examInfo.id,
          paperId:self.examInfo.exam_paper.id
        }
      })
      }
    },
    filters: {
      formatDate: function (timestamp) {
       return formatDateTime(timestamp,variables.dateType.FONT_FORMAT.flag) 
     }
   }
 }
</script>
<style lang="scss" scoped>
.exam{
 width: 100%;
 height:auto;
 min-height:100vh; 
 box-sizing:border-box;
 background:#F5F5F5;
 overflow:auto;
 .header-info{
  height: 1.12rem;
  padding:.86rem 0 0 .35rem;
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  font-size:.26rem;
  background:#FFFFFF;
  color:#222222;
}
.main{
  width: 100%;
  height:8.68rem;
  margin-top: .14rem;
  border-radius:.04rem;
  box-sizing: border-box;
  background:#ffffff;
  .guild{
    .title{
     width: 100%;
     height:1.19rem;
     line-height: 1.19rem;
     text-align: center;
     background: #ffffff;
     color:#333333;
     h4{
      font-size: .3rem;
      font-weight:bold;
      color:#000000;
    }
  }
  .content{
    height: 2.65rem;
    max-height: 2.65rem;
    padding: 0 .31rem 0 .36rem;
    overflow: auto;
    p{
      font-size: .26rem;
      text-indent: .3rem;
      line-height: .4rem;
      color:#999999;
    }
  }

}
.list{
  background:#ffffff;
  padding:0 .7rem;
  li{
    height: .70rem;
    padding-left:1.06rem;
    border-bottom:.01rem solid #E5E5E5;
    display: flex;
    align-items: center;
    font-size:.26rem;
    h6{
      margin-right:.34rem;
      font-weight:400;
      color:#222222;
    }
    span{
      color:#999999;
      label{
        color:#3587FC;
      }
    }
  }
}
}
.footer{
  height: 2.12rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .btn{
    width: 4rem;
    height: .9rem;
    background: #408FFE;
    border-radius: .08rem;
    font-size: .3rem;
    font-weight:500;
    color:#ffffff;
  }
}
}  

</style>
