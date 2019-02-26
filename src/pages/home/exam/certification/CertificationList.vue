<template>
  <div class="exam">
   <header>
    <base-header headerTitle="考试证书" returnName=""></base-header>
  </header>
  <main class="main">
    <div class="my">
      <header class="header">
        <h3 class="title">我的证书</h3>
      </header>
      <div class="content">
        <no-data  v-if="isMyCertNoData"></no-data>
        <ul class="list" v-else>
          <li class="item" v-for="(item,index) in myCertiList" :key="index" @click="toDetail(item.plan_id,item.certification_info.id)">
            <img src="/static/images/oa-mobile/home/exam/test_zhengshu_top1.png" alt="">
            <h2 class="name">{{item.certification_info.certification_name}}</h2>
            <time class="time">{{item.certification_info.update_time}}</time>
          </li>
        </ul>
      </div>
    </div>
    <div class="more">
      <header  class="header">
        <h3 class="title">待考证书</h3>
      </header>
      <div class="content">
        <no-data  v-if="isMoreCertNoData"></no-data>
        <ul v-else class="list">
         <li  class="item" v-for="(item,index) in moreCertiList" :key="index">
          <div class="desc">
           <img src="/static/images/oa-mobile/home/exam/test_zhengshu_more.png" alt="">
           <h2 class="name">{{item.certification_info.certification_name}} ({{item.plan_name}})</h2>
         </div>
         <button class="btn" @click="toExamNotice(item.plan_id)">考试拿证</button>
       </li>
     </ul>
   </div>
 </div>
</main>
</div>
</template>
<script>
  import BaseHeader from "@/components/common/BaseHeader";//公共头组件
  import NoData from "@/components/common/NoData";//公共无数据提示组件
  import variables from "@/assets/js/variables.js";//公共变量
  import storage from "@/assets/js/util/storage.js";//localStorage sessionStorage 存储
  export default{
    name:"ExamExplain",
    components: {
     BaseHeader,
     NoData
   },
   data(){
     return {
      page:1,
      pageSize:100,
      myCertiList:[],//我的证书列表
      moreCertiList:[],//待考证书列表
      isMyCertNoData:true,//我的证书列表是否无数据
      isMoreCertNoData:true//待考证书列表是否无数据
    }
  },
  mounted () {
    const self=this
    self.getMyCertification()
    self.getMoreCertification()
  },
  destroyed(){

  },
  methods:{
       /**
       *  @Description: 获取我的证书
       *  @Author: ykl
       **/
       getMyCertification(){
         const self=this
         let url = "exam/exam_staff/gain_certification"
         let requestData = {
           page:self.page,
           page_size:self.pageSize
         }
         self.$http.post(url, requestData).then(res => {
          let result=res.data.instance
          if(result.length>0){
            self.myCertiList=result
            self.isMyCertNoData=false
          }else{
            self.isMyCertNoData=true
          }
        }).catch(err => {
        }) 
      },
        /**
       *  @Description: 获取待考证书
       *  @Author: ykl
       **/
       getMoreCertification(){
         const self=this
         let url = "exam/exam_staff/lose_certification"
         let requestData = {
           page:self.page,
           page_size:self.pageSize
         }
         self.$http.post(url, requestData).then(res => {
          let result=res.data.instance
          if(result.length>0){
            self.moreCertiList=result
            self.isMoreCertNoData=false
          }else{
            self.isMoreCertNoData=true
          }
        }).catch(err => {
        }) 
      },
      /**
       *  @Description: 跳转到证书详情
       *  @Param: id 考试id
       *  @Param: id 证书id
       *  @Author: ykl
       **/
       toDetail(examId,certId){
         const self=this
         self.$router.push({
          path: '/certification-detail',
          query: {
            examId:examId,
            certId:certId
          }
        })
       },
      /**
       *  @Description: 跳转到考试通知
       *  @Param: id 考试id
       *  @Author: ykl
       **/
       toExamNotice(id){
         const self=this
         self.$router.push({
          path: '/exam-notice',
          query: {
            examId: id
          }
        })
       }
     }
   }
 </script>
 <style lang="scss" scoped>
 @import "../../../../assets/style/home/exam/common.scss";
 .exam{
  width: 100%;
  height:auto;
  min-height: 100vh;
}
.main{
 width: 100%;
 // margin-top:.86rem;
 padding-top:.7rem;
 box-sizing: border-box;
 background:#F5F5F5;
 .my{
  height:7.75rem;
  padding:0 .2rem;
  box-sizing: border-box;
  margin-top: .11rem; 
  background:#FFFFFF;
  .content{
    width: 100%;
    height:7.04rem;
    overflow-y: auto;
    padding:.28rem 1.12rem .21rem 1.01rem;
    box-sizing: border-box;
    .list {
      display: flex;
      justify-content: space-between;
      .item {
        margin-bottom: .43rem;
        text-align: center;
        .name{
          margin:.1rem 0 .12rem 0; 
        }
        img{
          width: 1.7rem;
          height: 2.25rem;
        }
      }
    }
  }
}
.more{
  height:4.2rem;
  padding:0 .2rem;
  box-sizing: border-box;
  margin-top: .11rem; 
  background:#FFFFFF;
  .content{
    height: 3.66rem;
    max-height: 3.66rem;
    overflow-y: auto;
    .list{
      .item{
        height:1.2rem;
        padding:0 .3rem;
        border-bottom:.01rem solid #E5E5E5;
        box-sizing: border-box;
        display: flex;
        flex-wrap: nowrap;
        justify-content:space-between;
        align-items: center;
        .desc{
          // min-width:5rem;
          display: flex;
          align-items:center;
          img{
            width:.72rem;
            height:.72rem;
            margin-right:.24rem;
          }
        }
        .btn{
          width:1.3rem;
          height:.56rem;
          background:#3689FE;
          font-size: .26rem;
          color:#FFFFFF;
          line-height: .56rem;
          @include borderRadius(.04rem);
        }
      }
    }
  }
}
}

/* 我的考试及代考证书公共样式头 */
.main>.my>,.main>.more>{
  .header{
    height:.71rem;
    border-bottom:.01rem solid #E5E5E5;
    padding:.24rem 0 .19rem .05rem;
    box-sizing: border-box;
  }
}
</style>
