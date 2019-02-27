<template>
  <div class="exam">
    <header class="header">
      <exam-base-header headerTitle="考试" returnName=""></exam-base-header>   
    </header>
    <main class="main">
      <div class="top">
        <header class="header">
          <h3 class="title" >当前考试&nbsp;({{currExamList.length}})</h3>
        </header>
        <div class="content">
          <no-data  v-if="isCurrExamNoData"></no-data>
          <ul v-else class="list">
            <li class="item" v-for="(item,index) in currExamList" :key=index>
              <div class="paper">
                <h3>{{item.plan_name}}</h3>
                <p>必须于<time>{{item.exam_end_time|formatDate}} </time>前完成考试</p>
              </div>
              <div class="btn-group">
                <button class="btn" @click="toExamNotice(item.plan_id)">考试</button>
              </div>
            </li>
          </ul>
        </div>
      </div> 
      <div class="bottom">
       <header class="header">
        <h3 class="title">历史考试&nbsp;({{histExamList.length}})</h3>
        <span class="more"></span>
      </header>
      <div class="content">
        <no-data  v-if="isHistExamNoData"></no-data>
        <ul class="list" >
          <li class="item" v-for="(item,index) in histExamList" :key=index @click="toExamOver(item.plan_id,item.exam_paper_id)">
            <img class="result-icon" :src="scoreLevelImgArr[item.level]" />
            <div class="paper">
              <h3>{{item.plan_name}}</h3>
              <p>必须于<time>{{item.exam_end_time|formatDate}} </time>前完成考试</p>
            </div>
            <div class="circle">
              <circle-progress :num=item.actual_score?item.actual_score:0 :totalNum=item.plan_total_score?item.plan_total_score:0></circle-progress>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </main>
  <footer class="footer">
    <header class="header">
      <h3 class="title">练习</h3>
    </header>
    <div class="content">
      <div class="content-left">
       <no-data v-if="isQuestionBankNoData"></no-data>
       <ul v-else>
        <li v-for="(item,index) in questionBankList" :key=index  @click="toExamExercise(exerciseTypeEnum.NORMAL_EXERCISE.flag,item.id,item.question_num)">
          <hgroup>
            <h3>{{item.depot_name}}</h3>
            <h3>{{item.knowledge_points.length}}</h3>
          </hgroup>
          <ul class="list">
            <!-- ,{'active':index==4} -->
            <li v-for="(item,index) in item.knowledge_points" :key="index" :class="['item']">
              {{item.point_name}}
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="content-right" @click="toExamExercise(exerciseTypeEnum.ERROR_EXERCISE.flag)">
      <h2>错题复练</h2>
      <strong class="num">{{errorTopicNum}}</strong>
    </div>
  </div>
</footer>
</div>
</template>
<script>
  import ExamBaseHeader from "./components/ExamBaseHeader";/*考试公共头组件*/
  import CircleProgress from "./components/CircleProgress";/*环形进度条组件*/
  import NoData from "@/components/common/NoData";//公共无数据提示组件
  import variables from "@/assets/js/variables.js";//公共变量
  import storage from "@/assets/js/util/storage.js";
  import {formatDateTime} from "@/assets/js/util/page-util.js";
  import {ui} from "@/assets/js/util/page-ui.js";//公共弹窗提示
  export default{
    name:"HomeView",
    components: {
      ExamBaseHeader,
      CircleProgress,
      NoData,
    },
    data(){
      return {
        examStatusEnum:variables.examStatus,//考试状态枚举
        personExamStatusEnum:variables.personExamStatus,//考生个人考试状态枚举
        exerciseTypeEnum:variables.exerciseType,//练习类型枚举
        page:1,
        pageSize:100,
        currExamList:[],//当前考试列表
        isCurrExamNoData:true,//最新是否无数据
        histExamList:[],//历史考试列表
        isHistExamNoData:true,//历史列表是否无数据
        timeFormatMnum:variables.dateType,
        questionBankList:[
          // knowledge_points:{}
        ],//题库列表
        scoreLevelImgArr:[
        "/static/images/oa-mobile/home/exam/test_mainicon_kao2.png",
        "/static/images/oa-mobile/home/exam/test_mainicon_kao1.png",
        "/static/images/oa-mobile/home/exam/test_mainicon_kao3.png"
        ],
        isQuestionBankNoData:true,//题库列表是否无数据
        errorTopicNum:0,//错误题目数量
      }
    },
    mounted () {
      const self=this
      self.getCurrExamList()
      self.getHistExamList()
      self.getQuestionBankList()
      self.getErrorTopicNum()
    },
    destroyed(){

    },
    methods:{
      /**
       *  @Description: 获取当前考试信息(取最新一条)
       *  @Author: ykl
       */
       getCurrExamList(){
        const self=this
        let url = "exam/exam_staff/need_exam_plan_list"
        let requestData = {
          page: 1,
          page_size:100,
          exam_status:self.examStatusEnum.ISSUE.flag+","+self.examStatusEnum.EXAM_IN_EXECUTE.flag,
          person_exam_status:self.personExamStatusEnum.NO_START_EXAM.flag+","+self.personExamStatusEnum.EXAM_IN_EXECUTE.flag
        }
        self.$http.post(url, requestData).then(res => {
          let result=res.data.instance
          if(result.length>0){
            self.currExamList=result
            self.isCurrExamNoData=false
          }else{
            self.isCurrExamNoData=true
          }
        }).catch(err => {
        })
      },
        /**
       *  @Description: 获取历史考试信息列表
       *  @Author: ykl
       */
       getHistExamList(){
        const self=this
        let url = "exam/exam_staff/finish_plan_list"
        let requestData = {
          page: self.page,
          page_size:100,
          person_exam_status:self.personExamStatusEnum.HAND_IN_PAPER.flag
        }
        self.$http.post(url, requestData).then(res => {
         let result=res.data.instance
         if(result.length>0){
          self.histExamList=result
          self.setScoreLevel()
          self.isHistExamNoData=false
        }else{
          self.isHistExamNoData=true
        }
      }).catch(err => {
      })
    },
      /**
       *  @Description: 设置分数级别
       *  @Author: ykl
       */
       setScoreLevel(){
        const self=this
        self.histExamList.forEach((item)=>{
          let excellentScore=(item.plan_total_score * 0.8)
          if(item.actual_score<item.plan_passed_score){
            item.level=0
          }else if(item.actual_score>=item.plan_passed_score&&item.actual_score<=excellentScore){
            item.level=1
          }else if(item.actual_score>=excellentScore&&item.actual_score<=item.plan_total_score){
            item.level=2
          }
        })
      },
     /**
       *  @Description: 获取题库列表
       *  @Author: ykl
       */
       getQuestionBankList(){
        const self=this
        let url = "exam/question_depot/list_for_practice"
        let requestData = {
          page: self.page,
          page_size:100
        }
        self.$http.post(url, requestData).then(res => {
         let result=res.data.instance
         if(result.length>0){
          self.questionBankList=result
          self.isQuestionBankNoData=false
        }else{
          self.isQuestionBankNoData=true
        }
      }).catch(err => {
      })
    },
     /**
       *  @Description: 通过获取错题集列表（拿到错题总数）
       *  @Author: ykl
       */
       getErrorTopicNum(){
        const self=this
        let url = "exam/question_wrong/list"
        let requestData = {
          page: 1,
          page_size:1
        }
        self.$http.post(url, requestData).then(res => {
         let result=res.data
         if(result)
          self.errorTopicNum=result.total_size
      }).catch(err => {
      })
    },
      /**
       *  @Description: 跳转到考试通知
       *  @Parem: examId 考试计划id
       *  @Author: ykl
       **/
       toExamNotice(examId){
         const self=this
         self.$router.push({
          path: '/exam-notice',
          query: {
            examId:examId
          }
        })
       },
      /**
       *  @Description: 跳转到考试
       *  @Parem: examId 考试计划id
       *  @Parem: paperId 试卷Id
       *  @Author: ykl
       **/
       toExamAnswer(examId,paperId){
        const self=this
        if(!examId||!paperId)//还没拿到数据，没有id拒绝跳转
          return 
        self.$router.push({
         path: '/exam-answer',
         query: {
          examId:examId,
          paperId:paperId
        }
      })
      },
       /**
       *  @Description: 跳转到考试结束
       *  @Parem: examId 考试计划id
       *  @Parem: paperId 试卷Id
       *  @Author: ykl
       **/
       toExamOver(examId,paperId){
         const self=this
         self.$router.push({
          path: '/exam-over',
          query: {
            examId: examId,//考试计划id
            paperId:paperId//试卷id
          }
        })
       },
         /**
       *  @Description: 跳转到练习
       *  @Parem: exerciseType 练习类型
       *  @Parem: topicBankId 题库id 默认值 ""
       *  @Parem: topicNum 题目数量 默认值 0
       *  @Author: ykl
       **/
       toExamExercise(exerciseType,topicBankId="",topicNum=0){
        const self=this
        if(self.errorTopicNum==0&&self.exerciseTypeEnum.ERROR_EXERCISE.flag==exerciseType){//如果是错题集练习，并且错题集数为0
          ui.msg("错题集没有题目")
          return
        }
        if(topicNum==0&&self.exerciseTypeEnum.NORMAL_EXERCISE.flag==exerciseType){//如果是普通题库练习，并且题目为0
          ui.msg("该题库没有题目")
          return
        }

        self.$router.push({
         path: '/exam-exercise',
         query: {
          exerciseType:exerciseType,
          topicBankId:topicBankId
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
@import "../../../assets/style/common.scss";
.exam{
  @include widthAndHeight(100%,auto);
  min-height: 100vh;
}
.exam >.header{
  width:100%;
  padding:0;
  height:1.94rem;
}
.main{
 width: 100%;
 padding:.13rem 0;
 box-sizing: border-box;
 background:#f5f5f5;
 .top{
  height:auto;
  min-height:2.12rem;
  box-sizing: border-box;
  border-radius:.04rem;
  background:#ffffff;
  .header{
    time{
      font-size:.22rem;
      font-weight:400;
      color:#999999;
    }
  }
  .content{
    .list{
      height: atuo;
      padding-left:.3rem;
      overflow:auto;
      .item{
        height:1.2rem;
        border-top:#e5e5e5 .01rem solid; 
        padding:0 .18rem 0 .09rem;
        display: flex;
        justify-content:space-between;
        align-items: center;
        .paper{
          // margin-left:.24rem;
          h3{
            font-size: 0.28rem;
            font-weight: normal;
            font-stretch: normal;
          }
          p{
            margin-top:.19rem;
            font-size: 0.22rem;
            font-weight: normal;
            color:#666666;
            time{
              color: #ff0000;
            }
          }
        }
        .btn-group{
         maring-top:.19rem;
         display: flex;
         .btn{
           width: 1.2rem;
           height:.48rem;
           margin:.13rem 0 0 .1rem;
           font-size: .22rem;
           line-height: .48rem;
           text-align:center;
         }
         .btn:nth-of-type(1){
           background:#3689fe;
           color:#ffffff;
         }
         .btn:nth-of-type(2){
           background:#3689fe;
           color:#ffffff;
         }
       }
     }
   }
 }
}
.bottom{
  height:auto;
  min-height:4.35rem;
  background: #ffffff;
  margin-top:.12rem;
  .header{
    // padding:;
    .more{
      color:#FF959595;
    }
  }
  .content{
    height: auto;
    overflow-y: auto;
    .list{
      padding:0 .2rem;
      .item{
        height:1.2rem;
        border-top:#e5e5e5 .01rem solid; 
        padding:0 .18rem 0 .09rem;
        display: flex;
        justify-content:space-between;
        align-items: center;
        .result-icon{
          width: .68rem;
          height: .68rem;
          @include borderRadius(50%);
        }
        .paper{
          // margin-left:.24rem;
          h3{
            font-size: 0.28rem;
            font-weight: normal;
            font-stretch: normal;
          }
          p{
            margin-top:.19rem;
            font-size: 0.22rem;
            font-weight: normal;
            color:#666666;
            time{
              color: #ff0000;
            }
          }
        }
      }
    }
  }
}
} 
.footer{
  padding:0 .2rem;
  .header{
    padding:0 .32rem 0 .05rem;
  }
  .content{
    height:3.36rem;
    padding-top:.1rem;
    padding:.1rem .23rem 0 .12rem;
    border-top:#e5e5e5 .01rem solid; 
    position: relative;
    .content-left{
      height: 100%;
      width:4.6rem;
      overflow-y: auto;
      hgroup{
        display: flex;
        h3{
          height: .48rem;
          border-radius: .04rem;
          font-size: 0.26rem;
          font-weight: normal;
          font-stretch: normal;
          line-height: .48rem;
          color: #15c815;
        }
        h3:nth-child(1){
         width: 3.9rem;
         padding-left: .15rem;
         box-sizing: border-box;
         background:linear-gradient(300deg, transparent .2rem, #e9fbdf 0);
       }
       h3:nth-child(2){
         width: .75rem;
         text-align: center;
         margin-left: -.15rem;
         background: linear-gradient(113deg, transparent .2rem, #e9fbdf 0);
       }
     }
     .list{
      padding:.2rem .06rem 0 0;
      display: flex;
      flex-wrap:wrap;
      .item{
        width: 1.4rem;
        height: .48rem;
        margin-left:.1rem;
        margin-bottom:.2rem;
        background-color: #ffffff;
        border-radius: .04rem;
        border: solid 1px #888888; //.01rem在实机上面太小显示不出来,故用px
        box-sizing: border-box;
        font-size: .24rem;
        font-weight: normal;
        text-align:center;
        line-height: .48rem;
        color: #888888;
        @include fontOverClip;
      }
      .active{
        background-color: #e3efff;
        border: solid .01rem #3689fe;
      }
    }
  }
  .content-right{
    width:1.87rem;
    height:2.45rem;
    position:absolute;
    top:.12rem;
    right: .03rem;
    @include backUrlAndSize("/static/images/oa-mobile/home/exam/test_caoti_bg.png");
    h2{
      position: absolute;
      top:.4rem;
      right:.42rem;
      font-size: 0.26rem;
      font-weight: normal;
      color: #666666;
    }
    .num{
      position: absolute;
      right:.73rem;
      bottom:.83rem;
      font-size: 0.52rem;
      font-weight: normal;
      color: #ff4242;
    }
  }
}
}
</style>
