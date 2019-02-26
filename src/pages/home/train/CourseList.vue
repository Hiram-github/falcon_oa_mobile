<template>
  <div class="course-list">
    <train-base-header headerTitle="课程列表" returnName=""></train-base-header> 
    <main class="main">
      <div class="top">
        <h3 class="title">全部课程</h3>
        <div class="option">
          <div class="select" @click="updateShowTypeListStatus()">分类&nbsp;&nbsp;<i class="fa fa-chevron-down" aria-hidden="true"></i></div>
          <div class="select" @click="updateShowTypeListStatus()">类型&nbsp;&nbsp;<i class="fa fa-chevron-down" aria-hidden="true"></i></div>
        </div>
      </div>
      <div class="content" v-show="isShowTypeLIst">
       <ul class="list">
        <li :class="['item',{'select':item.isSelect}]" v-for="(item,index) in typeList" :key="index" @click="updateTypeSelectStatus(item)">
          {{item.name}}
        </li>
      </ul>
      <div class="btn-group">
        <button class="btn reset" @click="resetTypeSelct()">重置</button>
        <button class="btn confirm" @click="updateShowTypeListStatus()">确认</button>
      </div>
    </div>
  </main>
</div>
</template>
<script>
  import TrainBaseHeader from "./components/TrainBaseHeader";//培训公共头部
  export default{
    name:"CourseList",
    components:{
      TrainBaseHeader
    },
    data(){
      return {
        typeList:[{name:"全部课程",isSelect:true},{name:"全部课程",isSelect:false},{name:"全部课程",isSelect:false},{name:"全部课程",isSelect:false},{name:"全部课程",isSelect:false},],
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
      },
      resetTypeSelct(){
        const self=this
        self.typeList.forEach((item)=>{
          item.isSelect=false;
        })
      },
      updateTypeSelectStatus(item){
        const self=this
        self.resetTypeSelct()
        item.isSelect=!item.isSelect
      }
    }
  }
</script>
<style lang="scss" scoped>
.course-list{
  .main{
    width: 100%;
    height:auto;
    .top{
      height:.92rem;
      padding:0 .13rem 0 .37rem;
      @include flexAndChildAlign(space-between);
      background-color: #f5f5f5;
      color: #666666;
      border-bottom:1px solid #e6e6e6;  
      .option{
       padding-top:.06rem;
       @include flexAndChildAlign;
       .select{
        width: 1.63rem;
        height: .55rem;
        @include borderRadius(.275rem);
        background-color: #ebebeb;
        text-align: center;
        line-height: .55rem;

      }
      .select:nth-of-type(1){
        margin-right:.14rem;
      }
      .select:hover {
        width: 1.97rem;
        height: 0.88rem;
        background-color: #fffefe;
        @include borderRadius(.1rem);
        line-height: .88rem;
      }
    }
  }
  .content{
    z-index:100;
    .list{
      height: auto;
      min-height: 3rem;
      display: flex;
      flex-wrap: wrap;
      padding:.59rem .48rem .2rem;
      .item{
        width: 1.6rem;
        height: .64rem;
        margin-left:.5rem;
        line-height:.64rem;
        text-align: center;
      }
      .select{
        color:#ffffff;
        background-color: #6da7fe;;
        border-radius: 0.08rem;
        border: solid 0.01rem #3183fd;
      }
    }
    .btn-group{
      height: .98rem;
      display: flex;
      .btn{
        width: 3.74rem;
        height: .98rem;
        text-align:center;
        line-height:.98rem;
        font-size: 0.32rem;
        font-weight: normal;
        font-stretch: normal;
      }
      .reset{
        color: #888888;
        background-color: #f5f5f5;
      }
      .confirm{
        color: #ffffff;
        background-color: #3587fc;
      }
    }
  }
}
}  
</style>
