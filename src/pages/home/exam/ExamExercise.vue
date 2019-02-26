<template>
  <div class="exam">
   <header>
    <base-header :headerTitle=headerTitle returnName=""></base-header>
    <div class="header-info" v-if="!isTopicNoData">
      <h3>该题所属知识点：{{topicList[currTopicIndex].question.knowledge_points[0].point_name?topicList[currTopicIndex].question.knowledge_points[0].point_name:''}}</h3>
      <div class="notice">
        <p>{{exerciseType==exerciseTypeEnum.NORMAL_EXERCISE.flag?"该题库":"错题集"}}共 {{topicList.length}} 题</p>      
      </div>
    </div>
  </header>
  <main class="main">
    <!-- 试题列表 -->
    <no-data  v-if="isTopicNoData"></no-data>
    <ul class="list" v-else>
      <h4>{{topicList[currTopicIndex].question.question_order+1}}、{{topicList[currTopicIndex].question.question}}</h4>
      <viewer v-show="isShowImg" :images="imgs">
        <img v-for="src in imgs" :src="src.url" :key="src.title">
      </viewer>
      <li v-for="(item,index) in topicList[currTopicIndex].question.answers" :key="index" :class="['item']" @click="selectAnswer(item)">
        <!-- 答题时显示按钮 -->
        <button v-if="!isShowTexp" :class="['quest-num-order',{'select':item.is_select==answerSelectMenu.SELECT.flag}]">
          {{answersOrderList[item.answer_order]}}
        </button>
        <!-- 解析时显示按钮 -->
        <button v-else :class="['quest-num-order',{'no-select':item.is_select==answerSelectMenu.SELECT.flag&&item.is_right==answerResultMenu.ERROR.flag},{'select':item.is_right==answerResultMenu.CORRECT.flag}]">
          {{answersOrderList[item.answer_order]}}
        </button>
        <strong>{{item.answer}}</strong>
      </li>
    </ul>
    <!-- 解析 -->
    <div class="explain" v-show="isShowTexp">
      <header  class="header">
        <h3 class="title">练习结果</h3>
      </header>
      <div class="content">
        <audio ref="hintAudio" :src="currentAudio"></audio>
        <p class="desc">
          <button v-show="topicList[currTopicIndex].question.isCorrect" class="hint check">
            <i class="fa fa-check" aria-hidden="true"></i>答案正确
          </button> 
          <button v-show="!topicList[currTopicIndex].question.isCorrect" class="hint cancel">
            <i class="fa fa-close" aria-hidden="true"></i>答案错误</button>
          </p>
          <p class="desc">您的选择：{{topicList[currTopicIndex].question.selAnsNos}}，正确答案：{{topicList[currTopicIndex].question.correctNos}}</p>
          <p class="desc">答案解析：{{topicList[currTopicIndex].question.question_analysis}}</p>
        </div>
      </div>
    </main>
    <footer class="footer">
      <!-- 透明遮罩 -->
      <div class="mask"v-show="isShowTnumList" @click="updateShowTnumStatus()">
      </div>
      <!-- 操作内容 -->
      <div class="option">
        <div class="top" v-if="!isTopicNoData">
          <button @click="lastTopic()" :class="['btn',{'no-select':currTopicIndex==0}]"><i class="fa fa-chevron-left" aria-hidden="true"></i></button>
          <button @click="nextTopic()" :class="['btn',{'no-select':currTopicIndex==topicNum-1}]"><i class="fa fa-chevron-right" aria-hidden="true"></i></button>
          <p class="num-order" @click="updateShowTnumStatus()">
            <img src="/static/images/oa-mobile/home/exam/test_datiicon_open.png"/>
            {{currTopicIndex+1}}/{{topicNum}}
          </p>
          <button class="btn" @click="checkAnswer()">
            <img src="/static/images/oa-mobile/home/exam/test_datiicon_jiaojuan.png"/>
            答题
          </button>
        </div>
        <ul class="list" v-show="isShowTnumList">
          <li v-for="(item,index) in topicList" :key="index" 
          :class="['item',{'last-item':(index+1)%6==0},setNumOrderStatus(item.question)?'check':'cancel']" @click="selectTopic(index)">
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
  import {formatDateTimem,getSelAnsRes} from "@/assets/js/util/page-util.js";
  export default{
    name:"ExamAnswer",
    components: {
      BaseHeader,
      NoData
    },
    data(){
      return {
        headerTitle:"练习",//头部标题
        page:1,
        pageSize:1000,
        topicBankId:"",//题库id
        examInfo:{
          exam_paper:{}
        },//考试信息对象
        timeFormatMnum:variables.dateType,//格式化时间类型枚举
        answerSelectMenu:variables.answerSelectType,//答案选择类型(状态)枚举
        answerResultMenu:variables.answerResultType,//答案结果类型枚举
        exerciseTypeEnum:variables.exerciseType,//练习类型枚举
        exerciseType:0,//练习类型
        examStatusObj:{},//考试状态对象
        topicList:[{question:{}}],//题目集合  TODO://因层级嵌套过多 为避免获取不到question 里面设置一个空对象
        currTopicIndex:0,//当前题目索引
        isFinishTopic:false,//是否做完题目
        isShowImg:false,//是否显示图片
        topicNum:0,//题目总数
        baseImgUrl:variables.baseImgUrl,
        imgUrl:'',
        isShowTnumList:false,//是否显示题目序号列表
        isShowTexp:false,//是否显示题目解析
        isTopicNoData:true,//题目列表是否无数据
        isExistData:false,//是否存在数据
        answersOrderList:variables.answersOrderList,//答案下标对应的字母序号列表
        alrAnswerIndexList:[],//已答题索引列表
        currentAudio:"/static/audio/home/exam/error.mp3",
        imgs: [
        {
          url:'',
          title: '题目图片'
        }
        ]
        //currTopicObj:topicList[currTopicIndex]//当前题目对象
      }
    },
    created () {
      const self=this
      self.exerciseType = self.$route.query.exerciseType//练习类型
      let exerTypeArr=["错题复练","题库练习"]
      self.headerTitle=exerTypeArr[self.exerciseType]
      if(self.exerciseType==self.exerciseTypeEnum.ERROR_EXERCISE.flag){
        self.getErrorTopicList()
      }else if(self.exerciseType==self.exerciseTypeEnum.NORMAL_EXERCISE.flag){
        self.topicBankId=self.$route.query.topicBankId//题库id
        self.getNormalTopicList()
      }
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
        self.updateShowTexpStatus(newVal)
        self.updateShowImgStatus()
      }

    }, 
    destroyed(){

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
        const self=this
        let answers=item.answers
        if(!answers)
          return

        if(self.isShowTexp){
          return getSelAnsRes(item).isCorrect
        }
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
       *  @Description: 获取错题集列表
       *  @Author: ykl
       **/

       getErrorTopicList(){
        const self=this
        let url = "exam/question_wrong/list"
        let requestData = {
          page: self.page,
          page_size:self.pageSize  
        }
        self.$http.post(url, requestData).then(res => {
          let result=res.data.instance
          if(result.length==0){
            self.isTopicNoData=true
            return;
          }
          self.topicList=result
          self.topicNum=result.length
          self.isTopicNoData=false
        }).catch(err => {
        }) 
      },
       /**
       *  @Description: 获取指定题目练习列表
       *  @Author: ykl
       **/
       getNormalTopicList(){
        const self=this
        let url = "exam/question/list"
        let requestData = {
          page: self.page,
          page_size:self.pageSize,  //TODO 注意：此处前期为了赶进度避免麻烦,写死了请求数。后期应该改成通过上一题下一题分页请求数据
          depot_id:self.topicBankId
        }
        self.$http.post(url, requestData).then(res => {
          let result=res.data.instance
          if(result.length==0){
            self.isTopicNoData=true
            return;
          }
          self.topicNum=result.length
          for(let i=0;i<result.length;i++){//此处拼接因为错题集跟练习接口反馈的内容结构不一样，这边用的是一个界面处理，故对数据处理拼接
            self.$set(self.topicList,i,{question:result[i]})//避免重新改变数组，vue无法监听
          }
          self.isTopicNoData=false
        }).catch(err => {
        }) 
      },
      /**
       *  @Description: 增加错题集记录
       *  @Parem: topicId 题目id
       *  @Parem: topicBankId 题目id       
       *  @Parem: answerIds 考生答题的信息，答案id用,拼接起来 
       *  @Author: ykl    
       **/
       addErrorTopic(topicId,topicBankId,answerIds){
        const self=this
        let url = "exam/question_wrong/answered"
        let requestData = {
          question_id: topicId,
          depot_id:topicBankId, 
          answer_by_person:answerIds
        }
        self.$http.post(url, requestData).then(res => {
        }).catch(err => {
        }) 
      },
       /**
       *  @Description:核对答案
       *  @Author: ykl
       **/
       checkAnswer(){
        const self=this

        let topicObj=self.topicList[self.currTopicIndex].question
        if(!topicObj)
          return

        if(self.isShowTexp)
          return

        self.alrAnswerIndexList.push(self.currTopicIndex);//记录已答题题目index
        let anSwerResult=getSelAnsRes(topicObj)//获取选择答案结果对象
        topicObj.selAnsNos=anSwerResult.selAnsNos//选择过的答案序号列表
        topicObj.correctNos=anSwerResult.correctNos//正确的答案序号列表
        topicObj.isCorrect=anSwerResult.isCorrect//答案是否真确
        if(anSwerResult.isCorrect){//答题正确
          self.currentAudio="/static/audio/home/exam/correct.mp3"
        }else{//答题错误
          self.currentAudio="/static/audio/home/exam/error.mp3"
          if(anSwerResult.errSelAnsIdStr)
            self.addErrorTopic(topicObj.id,topicObj.depot_id,anSwerResult.errSelAnsIdStr)
        }
        setTimeout(()=>{
         self.$refs.hintAudio.play()
       },500)
        self.isShowTexp=true;//显示解析
      },
      /**
       *  @Description: 设置显示图片状态
       *  @Author: ykl
       **/
       updateShowImgStatus(){
        const self=this
        let topicObj=self.topicList[self.currTopicIndex].question
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
       *  @Description: 修改答案解析显示状态
       *  @Author: ykl
       **/
       updateShowTexpStatus(index){
        const self=this
         for (let i = 0; i < self.alrAnswerIndexList.length; i++) {//避免未答题目直接看到答案解析
          let item=self.alrAnswerIndexList[i]
          console.log(item)
          if (index==item) {
            self.isShowTexp=true;//显示解析
            break;
          }else{
            self.isShowTexp=false;//不显示解析
          }
        }
      },
      /**
       *  @Description: 修改题号列表显示状态
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
        if(self.isShowTexp)
          return
        
        if(answerObj.is_select==self.answerSelectMenu.NO_SELECT.flag||!answerObj.is_select)
          this.$set(answerObj, 'is_select', self.answerSelectMenu.SELECT.flag)
        else if(answerObj.is_select==self.answerSelectMenu.SELECT.flag)
          this.$set(answerObj, 'is_select', self.answerSelectMenu.NO_SELECT.flag)
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
  }
}
.main{
 width: 100%;
 padding-top:.14rem;
 border-top:.01rem solid #E5E5E5;
 box-sizing: border-box;
 background:#F5F5F5;
 .explain>.header>h3{
  font-size: .3rem;
  font-weight: bold;
}
}
.footer{
}
</style>
