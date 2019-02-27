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
      <div class="sel-content" v-show="isShowTypeLIst">
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
    <div class="task-list">
     <header class="header">
      <h3 class="title">任务进度</h3>
    </header>
    <ul class="list">
      <li class="item" v-for="item in 8">
        <div class="option">
          <img src="/static/images/oa-mobile/home/train/video.jpg"/>
          <div class="rate">20%</div>
          <button class="play" @click="toVideoPaly()">
            <i class="fa fa-play" aria-hidden="true"></i>
            <!-- <i class="fa fa-pause" aria-hidden="true"></i> -->
          </button>
        </div>
        <h2 class="title">总裁看报表</h2>
        <div class="desc">
          <span class="">运营管理</span>
          <span class="">10课时</span>
        </div>       
      </li>
    </ul>
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
     /**
      *  @Description: 修改类型列表的显示状态
      *  @Author: ykl
      **/
      updateShowTypeListStatus(){
        const self=this
        self.isShowTypeLIst=!self.isShowTypeLIst;
      },
     /**
      *  @Description: 重置选择的类型
      *  @Author: ykl
      **/
      resetTypeSelct(){
        const self=this
        self.typeList.forEach((item)=>{
          item.isSelect=false;
        })
      },
     /**
      *  @Description: 修改选择的类型
      *  @Author: ykl
      **/
      updateTypeSelectStatus(item){
        const self=this
        self.resetTypeSelct()
        item.isSelect=!item.isSelect
      },
      /**
       *  @Description: 跳转到视频播放页
       *  @Author: ykl
       **/
       toVideoPaly(){
         const self=this
         self.$router.push({
          path: '/video-paly',
          query: {
          }
        })
       }
     }
   }
 </script>
 <style lang="scss" scoped>
 @import "../../../assets/style/common.scss";
 .course-list{
  .main{
    width: 100%;
    height:auto;
    position:relative;
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
  .sel-content{
    position: absolute;
    z-index:100;
    background: #ffffff;
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
  .task-list{
    .list{
      padding:.1rem .25rem 0 .27rem;
      display:flex;
      flex-wrap:wrap;
      justify-content:space-between;
      .item{
        width: 3.39rem; 
        border:solid 1px #e9eaea;
        margin-bottom: .23rem;
        .option{
          height: 1.9rem;
          position: relative;
          @include borderRadius(.1rem);
          img{
            width: 100%;
            height: 100%;
          }
          .rate,.play{
            height:.32rem;
            position: absolute;
            z-index:10;
            text-align:center;
            line-height: .32rem;
            background:#000000;
            color:#ffffff;
            @include borderRadius(.06rem);
          }
          .rate{
            width: .66rem;
            font-weight: normal;
            font-stretch: normal;
            top:.07rem;
            right:.07rem;
            font-size: 0.18rem;
          }
          .play{
            width: .5rem;
            left:.1rem;
            bottom:.1rem;


          }
        }
        .title{
          height:.51rem;
          padding-left:.18rem;
          border-bottom: solid 1px #e9eaea;
          line-height: .51rem;
          font-size: 0.24rem;
          color: #333333;
        }
        .desc{
          height: .59rem;
          padding:0 .31rem 0 .15rem;
          @include flexAndChildAlign(space-between);
          line-height:.59rem;
          font-size:.22rem;
          border-bottom: solid 1px #e9eaea;
          span:nth-child(1){
            color: #3689fe;
          }
          span:nth-child(2){
            color: #9f9d9b;
          }
        }
      }
    }
  }
}
}  
</style>
