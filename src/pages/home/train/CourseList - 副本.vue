<template>
  <div class="video-paly">
    <train-base-header headerTitle="课程列表" returnName=""></train-base-header> 
    <main class="main">
     <div class="top">
      <h3 class="title">当前学习进度: 15%</h3>
      <div class="select" @click="updateShowTypeListStatus()">
        <i class="fa fa-lg fa-star" aria-hidden="true"></i>&nbsp;&nbsp;添加到【我的课程】</i>
      </div>
    </div>
    <div class="video">
     <header class="header">
      <h3 class="title">北分值机操作规范/1.礼仪规范/1.1.着装</h3>
    </header>
  </div>
</main>
</div>
</template>
<script>
  import TrainBaseHeader from "./components/TrainBaseHeader";//培训公共头部
  export default{
    name:"VideoPaly",
    components:{
      TrainBaseHeader
    },
    data(){
      return {
        isShowTypeLIst:false
      }
    },
    created () {

    },
    destroyed(){

    },
    methods:{
      updateShowTypeListStatus(){
        const self=this
        self.isShowTypeLIst=!self.isShowTypeLIst;
      }
    }
  }
</script>
<style lang="scss" scoped>
@import "../../../assets/style/common.scss";
.video-paly{
  .main{
    width: 100%;
    height:auto;
    position:relative;
    .top{
      height:.92rem;
      padding:0 .37rem 0 .29rem;
      @include flexAndChildAlign(space-between);
      background-color: #f5f5f5;
      color: #666666;
      font-size: 0.24rem;
      border-bottom:1px solid #e6e6e6;  
      .select{
        width: 3.03rem;
        height: .55rem;
        @include borderRadius(.275rem);
        line-height: .55rem;
        background-color: #ffffff;
        color: #bcbcbc;
        text-align: center;

      }
    }
  }
}  
</style>
