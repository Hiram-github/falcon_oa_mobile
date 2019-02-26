<template>
  <div class="exam">
   <header>
    <base-header headerTitle="考试答题" returnName=""></base-header>
    <div class="header-info">
      <h3>{{examInfo.exam_name}}</h3>
      <div class="notice">
        <p>满分{{examInfo.exam_paper.total_score}}分，时间{{examInfo.exam_limited_time}}分钟，共{{examInfo.exam_paper.question_num}}题</p>      
        <div class="time">
          <img src="/static/images/oa-mobile/home/exam/test_dati_time.png" />
          <time class="timing">倒计时&nbsp;&nbsp;{{minute}}:{{second}}</time>
        </div>
      </div>
    </div>
  </header>
  <main class="main">
    <no-data  v-if="isTopicNoData"></no-data>
    <ul class="list" v-else>
     <h4>{{topicList[currTopicIndex].question_order+1}}、{{topicList[currTopicIndex].question}}</h4>
     <viewer v-show="isShowImg" :images="imgs">
      <img v-for="src in imgs" :src="src.url" :key="src.title">
    </viewer>
    <li v-for="(item,index) in topicList[currTopicIndex].answers" :key="index" :class="['item']" @click="selectAnswer(item)">
      <button :class="['quest-num-order',{'select':item.is_select==answerSelectMenu.SELECT.flag}]">{{answersOrderList[item.answer_order]}}</button>
      <strong>{{item.answer}}</strong>
    </li>
  </ul>
</main>
<footer class="footer">
  <!-- 透明遮罩 -->
  <div class="mask"v-show="isShowTnumList" @click="updateShowTnumStatus()">
  </div>
  <!-- 操作内容 -->
  <div class="option">
    <div class="top" v-if="!isTopicNoData">
      <button @click="lastTopic()" :class="['btn',{'no-select':currTopicIndex==0}]"><i class="fa fa-chevron-left" aria-hidden="true"></i></button>
      <p><img src="/static/images/oa-mobile/home/exam/test_datiicon_right.png"/>{{checkNum}}</p>
      <p><img src="/static/images/oa-mobile/home/exam/test_datiicon_wrong.png"/>{{topicNum-checkNum}}</p>
      <p class="num-order" @click="updateShowTnumStatus()">
        <img src="/static/images/oa-mobile/home/exam/test_datiicon_open.png"/>
        {{currTopicIndex+1}}/{{topicNum}}
      </p>
      <button @click="nextTopic()" :class="['btn',{'no-select':currTopicIndex==topicNum-1}]"><i class="fa fa-chevron-right" aria-hidden="true"></i></button>
      <button  class="btn commit" @click="submitExamIntera(true)">
        <img src="/static/images/oa-mobile/home/exam/test_datiicon_jiaojuan.png"/>
        交卷
      </button>
    </div>
    <ul class="list" v-show="isShowTnumList">
      <li v-for="(item,index) in topicList" :key="index" 
      :class="['item',{'last-item':(index+1)%6==0},setNumOrderStatus(item)?'check':'cancel']" @click="selectTopic(index)">
      {{index+1}}
    </li>
  </ul>
</div>
</footer>
</div>
</template>
<script>
  import BaseHeader from "@/components/common/BaseHeader";//公共头组件
  import NoData from "@/components/common/NoData";//公共无数据提示组件
  import storage from "@/assets/js/util/storage.js";//localStorage sessionStorage 存储
  import variables from "@/assets/js/variables.js";//公共变量
  import {ui} from "@/assets/js/util/page-ui.js";//公共弹窗提示
  import {formatDateTime} from "@/assets/js/util/page-util.js";
  import {MessageBox,Toast} from "mint-ui";
  import { Previewer } from 'vux'
  export default{
    name:"ExamAnswer",
    components: {
      BaseHeader,
      NoData,
      Previewer
    },
    data(){
      return {
        examId:"",//考试ID
        paperId:"",//试卷ID
        examInfo:{
          exam_paper:{}
        },//考试信息对象
        examTimerObj:null,//考试定时器对象
        isRefresh:-1,//是否刷新界面，默认为—1表示不刷新界面，不传或传0 后台认为界面存在刷新
        timeFormatMnum:variables.dateType,//格式化时间类型枚举
        answerSelectMenu:variables.answerSelectType,//答案选择类型(状态)枚举
        examStatusObj:{},//考试状态对象
        topicList:[{img_info:{}}],//题目集合
        currTopicIndex:0,//当前题目索引
        isFinishTopic:false,//是否做完题目
        topicNum:0,//题目总数
        topicWithTime:0,//记录个题目用时(毫秒)
        topicTimerObj:null,//题目用时定时对象
        minutes:1,//定时器显示的分钟
        seconds: 0,//定时器显示的秒
        baseImgUrl:variables.baseImgUrl,
        imgUrl:'',
        isShowImg:false,//是否显示图片
        isShowTnumList:false,
        checkNum:0,//答题数或正确答案数量
        isTopicNoData:true,//题目列表是否无数据
        answersOrderList:variables.answersOrderList,//答案下标对应的字母序号列表
        imgs: [
        {
          url:'',
          title: '题目图片'
        }
        ]
        //currTopicObj:topicList[currTopicIndex]//当前题目对象
      }
    },
    mounted () {
      const self=this
      //监听界面刷新
      window.onbeforeunload = () => {
        storage.sessionStorage.setItem("isRefresh","0")
      }
      self.examId = self.$route.query.examId
      self.paperId = self.$route.query.paperId
      self.getExamDetails(self.examId).then(()=>{
          self.minutes=self.examInfo.exam_limited_time//获取考试时间
          self.topicNum=self.examInfo.exam_paper.question_num//获取题目总数
        })
      if(!self.isFinishTopic&&self.currTopicIndex+1==self.topicNum)
        self.isFinishTopic=true
      self.getPaperInfo()
      self.setExamTiming()
      self.setTopicWithTime()
      self.watchSwitchPage();
    },
    destroyed(){
      const self=this
      if(self.examTimerObj)
         clearInterval(self.examTimerObj)//防止中途退出组件,销毁考试倒计时定时对象
       self.destroyTopicTimer()//销毁答题记时定时对象及重置答题记时数
       document.removeEventListener('visibilitychange', self.updateSwitchNum)//销毁监听页面切出次数的函数（该监听事件针对的是标签而不是页面，故要销毁）
       storage.sessionStorage.setItem("isRefresh","-1")

     },
     watch:{
      /**
       *  @Description: 监听当前题目索引变化
       *  @Author: ykl
       *  @param newVal 修改后的值
       *  @param oldVal 修改前的值
       **/
       currTopicIndex:function(newVal,oldVal){
        const self=this
        var topicNum=self.examInfo.exam_paper.question_num
        if(!self.isFinishTopic&&self.currTopicIndex+1==self.topicNum)
          self.isFinishTopic=true
        self.updateShowImgStatus()
        self.submitAnswer(oldVal)
        self.destroyTopicTimer()
        self.setTopicWithTime()
      }
    },
    computed: {
       /**
       *  @Description: 计算监听倒计时分
       *  @Author: ykl
       **/
       second: function () {
        return this.updateTimerFormat(this.seconds)
      },
       /**
       *  @Description: 计算监听倒计时秒
       *  @Author: ykl
       **/
       minute: function () {
        return this.updateTimerFormat(this.minutes)
      }
    },
    methods:{
      /**
       *  @Description: 更新切换次数
       *  @Author: ykl
       */
       updateSwitchNum() {
        const self=this
        let url = "exam/online/switch_time";
        let data = {
          exam_plan_id: self.examId,
          exam_paper_id: self.paperId
        };
        if (!document.hidden) {
          self.$http.post(url, data).then(res => {
            if (res.data.instance.is_need_submit) {
              self.submitExamIntera(false)
            }
          });
        }
      },
     /**
       *  @Description: 监听页面切换
       *  @Author: ykl
       */
       watchSwitchPage() {
        const self=this
        document.addEventListener("visibilitychange", self.updateSwitchNum);
      },
      /**
       *  @Description: 通过题目序号列表选择题目
       *  @Author: ykl
       */
       selectTopic(index){
         const self=this
         self.currTopicIndex=index
       },
      /** TODO:此处按vue的流程来说  这样写是个监听循环，后期须优化
       *  @Description: 设置题目序号列表选中状态
       *  @Author: ykl
       */
       setNumOrderStatus(item){
        const self=this
        let answers=item.answers
        if(!answers)
          return
        self.checkNum=document.getElementsByClassName("check").length
        for(let i=0;i<answers.length;i++){
          if(answers[i].is_select==self.answerSelectMenu.SELECT.flag){
            return true
          }
        }
      },
      /**
       *  @Description: 切换上一题（改变题目索引）
       *  @Author: ykl
       */
       lastTopic(){
         const self=this
         if(self.currTopicIndex>0)
          self.currTopicIndex--
      },
      /**
       *  @Description: 切换下一题（改变题目索引）
       *  @Author: ykl
       */
       nextTopic(){
        const self=this
        if(self.currTopicIndex+1<self.topicNum)
          self.currTopicIndex++
      },
      /**
       *  @Description: 倒计时显示为0:0时,修改为00:00
       *  @Author: ykl
       **/
       updateTimerFormat(timeNum){
        return timeNum < 10 ? '0' + timeNum : '' + timeNum
      },
       /**
       *  @Description: 记录考试当前题目用时
       *  @Author: ykl
       **/
       setTopicWithTime(){
        const self=this
        self.topicTimerObj=setInterval(()=>{
          self.topicWithTime+=1
        },1)//以毫秒计算，避免时间不够精确
      },
       /**
       *  @Description: 销毁考试当前题计对象
       *  @Author: ykl
       **/
       destroyTopicTimer(){
        const self=this
        if(self.topicTimerObj)
         clearInterval(self.topicTimerObj)//防止中途退出组件,销毁计时器定时对象
       if(self.topicWithTime!=0)
          self.topicWithTime=0//重置单个题目用时
      },

      /**
       *  @Description: 获取试题里列表
       *  @Author: ykl
       **/
       getPaperInfo(){
        const self=this
        let url = "exam/paper/examinee_get"
        let isRefresh=storage.sessionStorage.getItem("isRefresh")
        isRefresh?isRefresh:-1
        let requestData = {
          exam_plan_id: self.examId,
          exam_paper_id:self.paperId,
          is_refresh:isRefresh
        }
        self.$http.post(url, requestData).then(res => {
         /* if(res.code!=200){
            self.toExamNotice()
            return
          }*/
          self.examStatusObj=res.data.instance.online_exam_cache//获取在线考试状态
          if(self.examStatusObj.is_need_submit){
            self.submitExamIntera(false)
            return;
          }
          if(self.examStatusObj.last_question_id)
            self.currTopicIndex=self.examStatusObj.last_question_index

          self.setExamSurplusTime()//设置考试剩余时间

          let topicData=res.data.instance.paper_data.exam_record_questions
          if(topicData.length>0){
            self.isTopicNoData=false
            self.topicList=topicData
          }else{
            self.isTopicNoData=true
          }
        }).catch(err => {
        }) 
      },
     /**
       *  @Description: 设置显示图片状态
       *  @Author: ykl
       **/
       updateShowImgStatus(){
        const self=this
        let topicObj=self.topicList[self.currTopicIndex]
        if(!topicObj)
          return

        let imgInfo=topicObj.img_info
        if(imgInfo){
          self.isShowImg=true
          self.imgUrl=self.baseImgUrl+"/"+imgInfo.pic_path+"/"+imgInfo.pic_name
          self.imgs[0].url=self.imgUrl
        }else{
          self.isShowImg=false
        }
      },
      /**
       *  @Description: 设置显示题号列表状态
       *  @Author: ykl
       **/
       updateShowTnumStatus(){
        const self=this
        self.isShowTnumList=!self.isShowTnumList
      },
      /**
       *  @Description: 选择答案
       *  @Author: ykl
       **/
       selectAnswer(answerObj){
        const self=this
        if(answerObj.is_select==self.answerSelectMenu.NO_SELECT.flag||!answerObj.is_select)
          this.$set(answerObj, 'is_select', self.answerSelectMenu.SELECT.flag)
        else if(answerObj.is_select==self.answerSelectMenu.SELECT.flag)
          this.$set(answerObj, 'is_select', self.answerSelectMenu.NO_SELECT.flag)
      },
      /**
       *  @Description: 设置考试分钟倒计时
       *  @Author: ykl
       **/
       setExamTiming(){
        const self = this
        self.examTimerObj= setInterval(()=>{
          if (self.seconds === 0 && self.minutes !== 0) {
            self.seconds = 59
            self.minutes -= 1
          } else if (self.minutes === 0 && self.seconds === 0) {
            self.seconds = 0
            self.minutes=0
            clearInterval(self.examTimerObj)
            self.submitExamIntera(false)//定时结束，自动交卷
          } else {
            self.seconds -= 1
          }
        }, 1000)
      },
      /**
       *  @Description: 设置考试剩余时间
       *  @Author: ykl
       **/
       setExamSurplusTime(){
        const self = this
        if(!self.examStatusObj)
          return
        let timeDiff=self.examStatusObj.prediect_end_time-self.examStatusObj.current_time
        if(!timeDiff)
          return
        let totalSecNum=timeDiff/1000//1秒=1000毫秒(ms)
        self.minutes = Math.floor(totalSecNum/60);
        self.seconds =parseInt((totalSecNum%60).toFixed(0));
      /*  if (self.minutes <= 0 && self.seconds <= 0){
         clearInterval(self.examTimerObj)
         self.submitExamIntera(false)//定时结束，自动交卷
       }*/
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
       *  @Description: 根据不同交卷入口给出不同交互框
       *  @param: isClick 是否页面点击交卷
       *  @Author: ykl
       **/
       submitExamIntera(isClick){
        const self=this
        if(!isClick){
         ui.msg("系统自动交卷")
         self.submitExam()
       }else{
         MessageBox.confirm("确定交卷？").then(action => {
          if(action!='confirm')
            reject()
          self.submitExam()
        })
       }
     },
      /**
       *  @Description: 交卷
       *  @Author: ykl
       **/
       submitExam(){
         const self=this
          //避免当前题目答题后，没有提交答案，直接交卷
          self.submitAnswer(self.currTopicIndex).then(()=>{
           let url = "exam/paper/hand_in"
           let requestData = {
            plan_id: self.examId,
            paper_id:self.paperId,
            handin_time:formatDateTime(new Date(),self.timeFormatMnum.STRIKE_FORMAT.flag)
          }
          self.$http.post(url, requestData).then(res => {
            self.toBackByCode(res.code)
            self.toExamOver()
          }).catch(err => {
          }) 
        })
        },
      /**
       *  @Description: 答题
       *  @param: topicIndex 答题的题目索引
       *  @Author: ykl
       **/
       submitAnswer(topicIndex){
        const self=this
        let promise = new Promise(function(resolve, reject){
          let url = "exam/paper/submit_answer"
          let requestData = {
            plan_id: self.examId,
            paper_id:self.paperId,
            question_index:topicIndex,//记录此次答题题目的索引
            questions:{
              use_time:self.topicWithTime//该题答题用时
            },
            answer_time:formatDateTime(new Date(),self.timeFormatMnum.STRIKE_FORMAT.flag)
          }
          let currTopicObj=self.topicList[topicIndex]
          let answerList=currTopicObj.answers?currTopicObj.answers:[]
          let answerIdStr=""
          answerList.forEach((item)=>{
            if(item.is_select==self.answerSelectMenu.SELECT.flag)
              answerIdStr+=item.id+","//拼接选中答案的id
          })
          let requAnswer=requestData.questions//请求的题目相关参数
          requAnswer.id=currTopicObj.id
          if (answerIdStr.length > 0) 
            requAnswer.answers = answerIdStr.substr(0, answerIdStr.length - 1);//去掉拼接答案id最后一个逗号
          self.$http.post(url, requestData).then(res => {
            self.toBackByCode(res.code)
            if(res.code!=200)
              return
            self.examStatusObj=res.data.instance.online_exam_cache
            self.setExamSurplusTime()
            resolve()
          }).catch(err => {
            reject()
          }) 
        })
        return promise
      },
       /**
       *  @Description: 跳转到考试结束界面
       *  @Author: ykl
       **/
       toExamOver(){
         const self=this
         self.$router.push({
          path: '/exam-over',
          query: {
            examId: self.examInfo.id,
            paperId:self.examInfo.exam_paper.id
          }
        })
       },
      /**
       *  @Description: 根据code码，跳转到上一级界面
       *  @Author: ykl
       **/
       toBackByCode(code){
         if(code!=1000010021)//判断考生是否在其它客户端进入考试
          return
        const self=this
        self.$router.back()
      }
    }
  }
</script>
<style lang="scss" scoped>
@import "../../../assets/style/home/exam/common.scss";
.exam{
  width: 100%;
  height:auto;
  min-height: 100vh;
  overflow:auto;
}
.header-info{
  height: 1.12rem;
  padding:.86rem .27rem 0 .32rem;
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  font-size:.26rem;
  background:#FFFFFF;
  color:#222222;
  h3{
    font-size: .26rem;
    color:#333333
  }
  .notice{
    display: flex;
    justify-content:space-between;
    align-items: center;
    p{
      color:#999999;
    }
    .time{
     display: flex;
     align-items: center;
     img{
      width:.37rem;
      height:.33rem;
    }
    .timing{
      margin-left: .11rem;
      float: right;
      font-size: .24rem;
      font-weight: bold;
      color:#FFAE00;
    }
  }
}
}
.main{
 width: 100%;
 padding-top:.14rem;
 border-top:.01rem solid #E5E5E5;
 box-sizing: border-box;
 background:#F5F5F5;

}
.footer{
}
</style>
