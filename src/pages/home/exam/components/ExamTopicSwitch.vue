<template>
  <div class="exam-topic-switch">
    <footer class="footer">
      <button @click="lastTopic" :class="['btn',{'no-select':currTopicIndex==0}]">上一题</button>
      <p class="explain">当前第{{currTopicIndex+1}}题，共{{topicNum}}题</p>
      <button @click="nextTopic" :class="['btn',{'no-select':currTopicIndex==topicNum-1}]">下一题</button>
    </footer>
  </div>
</template>
<script>
 export default{
  name:"ExamTopicSwitch",
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
      /**
       *  @Description: 切换上一题（改变题目索引）
       *  @Author: ykl
       */
       lastTopic(){
         const self=this
         let indexEctype=self.currTopicIndex;  //建立一个子组件变量副本，避免直接修改父组件值，违背vue组件数值同步,vue检查报错
         if(indexEctype>0)
          indexEctype--
        self.$emit('update:currTopicIndex', indexEctype);
      },
      /**
       *  @Description: 切换下一题（改变题目索引）
       *  @Author: ykl
       */
       nextTopic(){
        const self=this
         let indexEctype=self.currTopicIndex;  //建立一个子组件变量副本，避免直接修改父组件值，违背vue组件数值同步,vue检查报错
         if(indexEctype+1<self.topicNum)
          indexEctype++
        self.$emit('update:currTopicIndex', indexEctype);
      }
    }/*,
     watch: {
      /**
       *  @Description: 监听题目索引（改变父组件题目索引）
       *  @Author: ykl
       
       currTopicIndex(newVal, oldVal) {
        // 在监听你使用update事件来更新word,而在父组件不需要调用该函数
        this.$emit('update:currTopicIndex', newVal);
    }
  },*/
}
</script>
<style lang="scss" scoped>
.exam-topic-switch{
  width: 100%;
}
.footer{
  height: 1.63rem;
  padding:0 .3rem;
  display: flex;
  justify-content:space-between;
  align-items: center;
  .explain{
    font-size: .22rem;
    color:#888888;
  }
  .btn{
    width: 1.4rem;
    height: .6rem;
    border-radius: .04rem;
    background: #3587FC;
    font-size: .24rem;
    font-weight:500;
    color:#ffffff;
  }
  .no-select{
    background: #ffffff;
    color:#3689FE;
  }
}
</style>
