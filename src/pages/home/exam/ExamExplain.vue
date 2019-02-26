<template>
  <div class="exam">
   <header>
    <base-header headerTitle="考试解析" returnName=""></base-header>
    <div class="header-info">
      <hgroup>
        <h3>{{examInfo.exam_name}}</h3>
        <h3 class="score">得分: {{statisInfo.person_score}}</h3>
      </hgroup>
      <div class="notice">
        <p>
          最高分{{statisInfo.highest_score}}分 | 平均分{{statisInfo.average_score | formatScore}}分 | 排名 {{statisInfo.ranking_num}}/{{statisInfo.person_handin_num}}
        </p>      
        <div class="time">
          <time class="timing">{{statisInfo.person_finish_time}} 交卷</time>
        </div>
      </div>
    </div>
  </header>
  <main class="main">
    <!-- 试题列表 -->
    <no-data  v-if="isTopicNoData"></no-data>
    <ul class="list" v-else>
     <h4>{{topicList[currTopicIndex].question_order+1}}、{{topicList[currTopicIndex].question}}</h4>
     <viewer v-show="isShowImg" :images="imgs">
        <img v-for="src in imgs" :src="src.url" :key="src.title">
      </viewer>
     <li v-for="(item,index) in topicList[currTopicIndex].answers" :key="index" :class="['item']">
      <button :class="['quest-num-order',{'no-select':item.is_select==answerSelectMenu.SELECT.flag &&item.is_right==answerResultMenu.ERROR.flag},
      {'select':item.is_right==answerResultMenu.CORRECT.flag}]">
      {{answersOrderList[item.answer_order]}}
    </button>
    <strong>{{item.answer}}</strong>
  </li>
</ul>
<!-- 解析 -->
<div class="explain" v-if="!isTopicNoData">
  <header  class="header">
    <h3 class="title">答题结果</h3>
  </header>
  <div class="content">
    <p class="desc">
      <button v-show="topicList[currTopicIndex].isCorrect" class="hint check">
        <i class="fa fa-check" aria-hidden="true"></i>答案正确
      </button> 
      <button v-show="!topicList[currTopicIndex].isCorrect" class="hint cancel">
        <i class="fa fa-close" aria-hidden="true"></i>答案错误</button>
      </p>
      <p class="desc">您的选择：{{topicList[currTopicIndex].selAnsNos}}，正确答案：{{topicList[currTopicIndex].correctNos}}</p>
      <p class="desc">答案解析：{{topicList[currTopicIndex].question_analysis}}</p>
    </div>
  </div>
</main>
<footer class="footer">
  <!-- 透明遮罩 -->
  <div class="mask"v-show="isShowTnumList" @click="updateShowTnumStatus()">
  </div>
  <!-- 操作内容 -->
  <div class="option">
    <div class="top">
      <button @click="lastTopic()" :class="['btn',{'no-select':currTopicIndex==0}]"><i class="fa fa-chevron-left" aria-hidden="true"></i></button>
      <p><img src="/static/images/oa-mobile/home/exam/test_datiicon_right.png"/>{{statisInfo.answer_right_num}}</p>
      <p><img src="/static/images/oa-mobile/home/exam/test_datiicon_wrong.png"/>{{statisInfo.errorTopicNum}}</p>
      <p class="num-order" @click="updateShowTnumStatus()">
        <img src="/static/images/oa-mobile/home/exam/test_datiicon_open.png"/>
        {{currTopicIndex+1}}/{{topicNum}}
      </p>
      <button @click="nextTopic()" :class="['btn',{'no-select':currTopicIndex==topicNum-1}]"><i class="fa fa-chevron-right" aria-hidden="true"></i></button>
    </div>
    <ul class="list" v-show="isShowTnumList ">
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
  import variables from "@/assets/js/variables.js";//公共变量
  import {getSelAnsRes} from "@/assets/js/util/page-util.js";
  import storage from "@/assets/js/util/storage.js";//localStorage sessionStorage 存储
  export default{
    name:"ExamExplain",
    components: {
     BaseHeader,
     NoData
   },
   data(){
     return {
      examId:"",//考试计划id
      paperId:"",//试卷id
      answerSelectMenu:variables.answerSelectType,//答案选择类型(状态)枚举
      answerResultMenu:variables.answerResultType,//答案结果类型(状态)枚举
      topicList:[{img_info:{}}],//当前题目集合
       currTopicIndex:0,//当前题目索引
       topicNum:0,//题目总数
       examInfo:{
        exam_paper:{}
      },
      statisInfo:{},
      answersOrderList:variables.answersOrderList,//答案下标对应的字母序号列表
      baseImgUrl:variables.baseImgUrl,
      imgUrl:'',
      isShowImg:false,//是否显示图片
      isShowTnumList:false,//是否显示序号列表
      isTopicNoData:true,//题目列表是否无数据
      imgs: [
      {
        url:'',
        title: '题目图片'
      }
      ]
    }
  },
  mounted () {
   const self=this
   let initTopicIndex=self.$route.query.initTopicIndex
   if(initTopicIndex)
     self.currTopicIndex=Number(initTopicIndex)
   self.examId=self.$route.query.examId//考试计划id
   self.paperId=self.$route.query.paperId//试卷id
   self.getPerformance()
   self.getPaperInfo()
 },
 destroyed(){

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
        self.updateShowImgStatus()
      }

    }, 
    methods:{
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
        return getSelAnsRes(item).isCorrect
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
          let totalTopicNum=self.examInfo.exam_paper.question_num
          self.topicNum=totalTopicNum

          if(!data.statistics_info)
            return
          self.statisInfo=data.statistics_info[0]

          if(totalTopicNum==self.statisInfo.unanswered_num){//如果未答==题目总数 设置错题数为0
           self.statisInfo.errorTopicNum=0
           return
         }
         let trueAndNullNum=self.statisInfo.answer_right_num+self.statisInfo.unanswered_num
         if(totalTopicNum&&trueAndNullNum)
            self.statisInfo.errorTopicNum=totalTopicNum-trueAndNullNum//
        },
      /**
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
            let result=res.data.instance.exam_record_questions
            if(!result){
              self.isTopicNoData=true
              return;
            }
            for(let i=0;i<result.length;i++){
              let topicObj=result[i]
              let anSwerResult=getSelAnsRes(topicObj)//获取选择答案结果对象
              topicObj.selAnsNos=anSwerResult.selAnsNos//选择过的答案序号列表
              topicObj.correctNos=anSwerResult.correctNos//正确的答案序号列表
              topicObj.isCorrect=anSwerResult.isCorrect//答案是否真确
            }
            self.topicList=result
            self.isTopicNoData=false
          }).catch(err => {
          }) 
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
         *  @Description: 设置显示图片状态及拼接图片路径
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
  hgroup{
    display: flex;
    justify-content:space-between;
    h3{
      font-size: .25rem;
      color:#333333
    }
    .score{
      float: right;
    }
  }
  .notice{
    display: flex;
    justify-content:space-between;
    align-items: center;
    p{
      font-size: .22rem;
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
      font-size: .22rem;
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
 .explain{
  height:auto;
  min-height:3.3rem;
  padding:0 .2rem;
  box-sizing: border-box;
  margin-top: .11rem; 
  background:#FFFFFF;
  .header{
    height:.9rem;
    border-bottom:.01rem solid #E5E5E5;
    padding:.45rem 0 .17rem .14rem;
    box-sizing: border-box;
  }
  .content{
    width: 100%;
    height:2.39rem;
    padding:.22rem .12rem 0 .33rem;
    box-sizing: border-box;
    .desc{
      font-size:.26rem;
      line-height:.48rem;
      color:#666666;
    }
  }
}
}
.footer{
  .top{
    border-top:.02rem solid #E5E5E5 !important;
  }
} 
</style>
