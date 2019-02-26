<template>
 <ul class="list">
  <img v-show="topicList[currTopicIndex].img_info" :src="topicList[currTopicIndex].img_info.pic_path?baseTopicImgUrl+''+topicList[currTopicIndex].img_info.pic_path+'/'+topicList[currTopicIndex].img_info.pic_name:''"/>
  <h4>{{topicList[currTopicIndex].question_order+1}}、{{topicList[currTopicIndex].question}}</h4>
  <li v-for="(item,index) in topicList[currTopicIndex].answers" :key="index" 
  :class="['item',{'last-itme':index==0,'active':item.is_select==answerSelectMenu.SELECT.flag}]" 
  @click="selectAnswer(item)">
  <strong>{{item.answer}}</strong>
  <i class="fa fa-check-circle fa-2x"></i>
</li>
</ul>
</template>
<script>
 export default{
  name:"TopicList",
  data(){
    return {
      exanInfo:{}

    }
  },
  props:{
    currTopicIndex:{
      type:Number,
      required:true
    },
    topicNum:{
      type:Number,
      required:true
    }
  },
  created(){
  },
  destroyed(){
  },
  methods:{
    
  }
}
</script>
<style lang="scss" scoped>
.list{
  background:#ffffff;
  padding: .6rem 0 .6rem .2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  img{
    width: 100%;
    height:100%;
    max-width:80vw;
    max-height:3rem;
    margin-bottom: .2rem;
  }
  h4{
    align-self: flex-start;
    font-size: .28rem;
  }
  .item{
    width:5rem;
    height:.9rem;
    margin-top: .42rem;
    position: relative;
    text-align: center;
    background: #ffffff;
    border:.01rem solid #3587FC;
    border-radius: .06rem;
    line-height: .9rem;
    font-size:.28rem;
    font-weight:400;
    i{
      position: absolute;
      top:.19rem;
      right: .39rem; 
      color:#ffffff;
    }
  }
  .last-itme{
    margin-top: .68rem;
  }
  .active{
    background: #3587FC;
    color:#ffffff;
  }
}
</style>
