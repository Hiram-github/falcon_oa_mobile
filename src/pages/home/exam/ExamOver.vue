<template>
  <div class="exam">
    <header class="header">
      <exam-base-header headerTitle="考试结果" returnName=""></exam-base-header>   
    </header>
    <main class="main">
      <div class="tag" @click="toExamExplain()">
        <div class="base-info">
          <h2>{{examInfo.exam_name}}</h2>
          <time>{{statisInfo.person_finish_time}} 交卷 用时 {{examUseTime}}</time>
          <div class="result">
            <h6>考试得分</h6>
            <span class="score">{{statisInfo.person_score}}</span>
            <span :class="['level',examStateClassArr[statisInfo.is_passed]]">
            {{statisInfo.is_passed==0?'不合格':'合格'}}</span>
          </div>
        </div>
        <ul class="list">
          <li class="item"><span class="value">{{statisInfo.highest_score}}</span><h5 class="name">最高分</h5></li>
          <li class="item"><span class="value">{{statisInfo.average_score | formatScore}}</span><h5 class="name">平均分</h5></li>
          <li class="item"><span class="value">{{statisInfo.person_handin_num}}</span><h5 class="name">考试人数</h5></li>
          <li class="item"><span class="value">{{statisInfo.ranking_num}}</span><h5 class="name">我的排名</h5></li>
        </ul>
      </div>
      <div class="stide">
        <h4 class="title">查看错题</h4>
        <h4 class="hint">
          <span>共{{examInfo.exam_paper.question_num}}题,</span>
          <span>
            答错<label class="red">{{statisInfo.errorTopicNum}}</label>题
          </span>
          <span>
            正确<label class="green">{{statisInfo.answer_right_num}}</label>题
          </span>
          <span>
            未做<label class="red">{{statisInfo.unanswered_num}}</label>题
          </span>
          <i v-show="!isShowTopicNum" class="fa fa-angle-right" aria-hidden="true" @click="updateShowTuStatus()"></i>
          <i v-show="isShowTopicNum" class="fa fa-angle-down" aria-hidden="true" @click="updateShowTuStatus()"></i>
        </h4>
        <ul class="list" v-show="isShowTopicNum">
          <li v-for="(item,index) in topicList" :key="index" @click="toExamExplain(index)"
          :class="['item',{'line-last-itme':(index+1)%10==0},setNumOrderStatus(item)?'check':'cancel']">
          {{index+1}}
        </li>
      </ul>
    </div>
  </main>
  <footer id="footer">
    <h4 class="title">弱项分析</h4>
    <h4 class="hint"><label class="red">知识点</label>图谱如下，还需多学习</h4>
    <radar-map :examId=$route.query.examId></radar-map>
  </footer>
</div>
</template>
<script>
  import ExamBaseHeader from "./components/ExamBaseHeader";//考试公共头部
  import RadarMap from "./components/RadarMap";/*技能雷达图组件*/
  import variables from "@/assets/js/variables.js";//公共变量
  import {getSelAnsRes} from "@/assets/js/util/page-util.js";
  import storage from "@/assets/js/util/storage.js";//localStorage sessionStorage 存储
  export default{
    name:"HomeView",
    components: {
      ExamBaseHeader,
      RadarMap
    },
    data(){
      return {
       answerSelectMenu:variables.answerSelectType,//答案选择类型(状态)枚举
       examInfo:{
        exam_paper:{}
      },
      examId:"",//考试计划id
      paperId:"",//试卷id
      topicList:[{img_info:{}}],//题目集合
      statisInfo:{},
      examUseTime:"00:00",//考试使用时间
      examStateClassArr:['no-qualified','qualified'],//考试结果状态clsss数组
      isShowTopicNum:false,//是否显示题目序号列表
      knowAnalList:[],//知识点分析列表
      isknowAnalNoData:true,
    }
  },
  created () {//
    const self=this
    self.examId=self.$route.query.examId//考试计划id
    self.paperId=self.$route.query.paperId//试卷id
    self.getPerformance()
    self.getPaperInfo()
  },
  destroyed(){

  },
  methods:{
       /**
       *  @Description: 修改显示题号列表状态
       *  @Author: ykl
       **/
       updateShowTuStatus(){
        const self=this
        self.isShowTopicNum=!self.isShowTopicNum
      },
       /** TODO:此处按vue的流程来说  这样写是个监听循环，后期须优化
       *  @Description: 设置题目序号列表选中状态
       *  @Author: ykl
       */
       setNumOrderStatus(item){
        return getSelAnsRes(item).isCorrect
      },

       /**
       *  @Description: 根据秒计算考试用时
       *  @Author: ykl
       **/
       setExamUseTime(){
        const self = this
        if(!self.statisInfo.use_time)
          return;
        let timeDiff=Number(self.statisInfo.use_time)/1000
        let minutes = Math.floor(timeDiff/60)
        let seconds =parseInt((timeDiff%60).toFixed(0))
        self.examUseTime=self.updateTimerFormat(minutes)+":"+self.updateTimerFormat(seconds)
      },
       /**
       *  @Description: 时间显示为0:0时,修改为00:00
       *  @Author: ykl
       **/
       updateTimerFormat(timeNum){
        return timeNum < 10 ? '0' + timeNum : '' + timeNum
      },
       /**
        *  @Description: 获取考生成绩
        *  @Author: ykl
        **/
        getPerformance(){
          const self=this
          let url = "exam/performance/get_person_performance"
          let requestData = {
            plan_id: self.examId
          }
          self.$http.post(url, requestData).then(res => {
            self.setBaseData(res.data.instance)
          }).catch(err => {
          }) 
        },
        setBaseData(data){
          const self=this;
          self.examInfo=data.plan_info
          self.examInfo.exam_paper=data.paper_info

          if(!data.statistics_info)
            return
          self.statisInfo=data.statistics_info[0]
          self.setExamUseTime()

          let totalTopicNum=self.examInfo.exam_paper.question_num
          if(totalTopicNum==self.statisInfo.unanswered_num){//如果未答==题目总数 设置错题数为0
           self.statisInfo.errorTopicNum=0
           return
         }

         let trueAndNullNum=self.statisInfo.answer_right_num+self.statisInfo.unanswered_num
         if(totalTopicNum&&trueAndNullNum)
            self.statisInfo.errorTopicNum=totalTopicNum-trueAndNullNum//
        },
       /**
         *  @Description: 获取试题里列表
         *  @Author: ykl
         **/
         getPaperInfo(){
          const self=this
          let url = "exam/performance/get_person_paper"
          let requestData = {
            plan_id: self.examId
          }
          self.$http.post(url, requestData).then(res => {
            self.topicList=res.data.instance.exam_record_questions
          }).catch(err => {
          }) 
        },
      /**
       *  @Description: 跳转到考试解析
       *  @Author: ykl
       *  @param index 初始解析题目索引
       **/
       toExamExplain(index=0){
         const self=this
         self.$router.push({
          path: '/exam-explain',
          query: {
           examId: self.examId,
           paperId:self.paperId,
           initTopicIndex: index
         }
       })
       }
     },
      filters:{
       /**
       *  @Description: 格式化分数(保留一位小数)
       *  @Author: ykl
       *  @param score 需要格式化的分数
       **/
       formatScore:function(score){
        if(typeof score!="number")
          return ""
        if(String(score).indexOf(".")==-1)
          return score
        return score.toFixed(1)
      }
    }
  }
</script>
<style lang="scss" scoped>
@import "../../../assets/style/home/exam/common.scss";
.exam{
  width: 100%;
  height:100vh;
  min-height:100vh;
  overflow-x: hidden;
}
.exam >.header{
  width:100%;
  height:1.94rem;
  padding:0;
}
.main{
 width: 100%;
 padding:0 .2rem;
 margin-bottom: 0 !important;//避免跟考试模块common.css样式冲突
 box-sizing: border-box;
 .tag{
  width: 7.1rem;
  height:3.52rem;
  position:relative;
  @include backUrlAndSize("/static/images/oa-mobile/home/exam/test_result_topbg.png");
  .base-info{
    color:#FFFFFF;
    text-align:center;
    padding-top:.24rem;
    box-sizing: border-box;
    time{
      display: inline-block;
      font-size:.22rem;
      color:#b9ccfa;
      margin:.12rem 0 .15rem 0;
    }
    .result{
      height:1.2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      .h6{
        font-size:.24rem;
      }
      .score{
        display: inline-block;
        margin:0 .42rem 0 .39rem;
        font-size:1.2rem;
        font-weight:normal;
      }
      .level{
        display: inline-block;
        width:1.06rem;
        height:.45rem;
        border-radius:.04rem;
        background:#3ECA0D;
        text-align:center;
        line-height:.45rem;
      }
      .qualified{
       background: #45C300;
     }
     .no-qualified{
       background:#fb0e0e;
     }
   }
 }

 .list{
  width:100%;
  height:1.2rem;
  position: absolute;
  bottom:0;
  display: flex;
  justify-content: space-around;
  .item{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    color:#FFFFFF;
    .name{
      font-size: 0.22rem;
    }
    .value{
      font-size: 0.36rem;
    }
  }
}
}
.stide{
  margin-top:.32rem;
  padding:0 .13rem .32rem;

  border-bottom:.01rem solid #E5E5E5;
  .fa{
   float: right;
   margin-left: .21rem;
 }
 .list{
  display: flex;
  flex-wrap: wrap;
  .item{
    width:.44rem;
    height:.44rem;
    margin-top:.33rem;
    margin-right:.265rem;
    border:.01rem solid #E0E0E0;
    background:#F5F5F5;
    // border:.01rem #39DC00 solid;
    box-sizing: border-box;
    font-size:.22rem;
    line-height: .44rem;
    // color:#39DC00;
    text-align:center;
    @include borderRadius(50%);
  }
  .line-last-itme{
    margin-right:0;
  }
  .error-active{
    border:.01rem #FF0000 solid;
    color:#FF0000;
  }
}
}

}
#footer{
  margin-top:.33rem;
  height: 3.5rem;
  padding:0 .33rem;
  box-sizing: border-box;
  overflow-x: none;
}
/* 公共标题下方提示 */
.title{
  height:.28rem;
  padding-left:.2rem;
  border-left:.03rem solid #3689FE;
  font-weight:400;
  line-height:.28rem;
  font-size:.24rem;
  color:#3689FE;
}
/* 公共标题下方提示 */
.hint{
  margin-top: .39rem;
  padding-left:.1rem;
  font-size:.24rem;
  color:#333333;
  .red{
    color:#FF0000;
  }
  .green{
    color:#00D100;
  }
}


</style>
