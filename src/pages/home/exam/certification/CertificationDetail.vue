<template>
  <div class="exam">
    <header>
      <base-header headerTitle="证书详情"  returnName=""></base-header>
    </header>
    <main class="main">
      <div class="top">
        <hgroup class="title-group">
          <h1>{{certObj.plan_name}}</h1>
          <h2>技能认证证书</h2>
          <h4>Certificate of honor</h4>
        </hgroup>
      </div>
      <div class="center">
        <div class="hint">
          <p class="chain-hint">将此证书颁发给</p>
          <p class="eng-hint" style="maring-top:.11rem;">Issue this certificate to</p>
        </div>
        <h1 class="name">{{loginUser}}</h1>
        <div class="desc">
          <div class="chain-desc">
            <p>参加<{{certObj.plan_name}}>考试合格 </p>
            <p style="margin:.2rem 0 .25rem 0">特发此证，以资鼓励 </p>
          </div>
          <p class="eng-desc">Qualified in Standardized Operation of Unit Skills Examinatio</p>
        </div>
      </div>
      <div class="bottom">
        <time>{{certObj.certification_info.update_time}}</time>
        <strong class="company">中国安防协会</strong>
      </div>
    </main>
  </div>
</template>
<script>
  import BaseHeader from "@/components/common/BaseHeader";//公共头组件
  import variables from "@/assets/js/variables.js";//公共变量
  import storage from "@/assets/js/util/storage.js";//localStorage sessionStorage 存储
  export default{
    name:"ExamExplain",
    components: {
     BaseHeader
   },
   data(){
     return {
      examId:"",
      certId:"",
      loginUser:"",
      certObj:{
        certification_info:{}
      }
    }
  },
  mounted () {
    const self=this
    self.examId=self.$route.query.examId
    self.certId=self.$route.query.certId
    self.getCertificationDeail()

    let userInfo = storage.localStorage.getLoginUserInfo()
    if(!userInfo)
      return
    let name =userInfo.name//用户名
    if(name != undefined)
      self.loginUser = name
    else
      self.loginUser = userInfo.user_name
  },
  destroyed(){

  },
  methods:{
       /**
       *  @Description: 获取待考证书
       *  @Author: ykl
       **/
       getCertificationDeail(){
         const self=this
         let url = "exam/exam_staff/find_certification"
         let requestData = {
           plan_id:self.examId,
           certification_id:self.certId
         }
         self.$http.post(url, requestData).then(res => {
         self.certObj=res.data.instance

        }).catch(err => {
        }) 
      }
    }
  }
</script>
<style lang="scss" scoped>
  // @import "../../../../assets/style/home/exam/common.scss";
  .exam{
    width: 100%;
    height:auto;
    min-height: 100vh;
    overflow:auto;
  }
  .main{
    height:calc(100vh - .86rem);
    max-height: 12.6rem;
    position: relative;
    padding-top:.86rem;
    @include backUrlAndSize("/static/images/oa-mobile/home/exam/test_zhengshu_bg.png");
    .top{
      height:2.3rem;
      padding-top:.7rem;
      box-sizing: border-box;
      .title-group{
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        color:#E94E4D;
        h1{
          font-size:.59rem;
          font-family:FZDBSJW--GB1-0;
          font-weight:400;
        }
        h2{
          font-size:.5rem;
        }
        h4{
          font-size:.22rem;
        }
      }
    }
    .center{
      width: 100%;
      height: 4.11rem;
      position: absolute;
      top:5.14rem;
      display: flex;
      justify-content:space-around;
      flex-direction: column;
      align-items: center;
      text-align: center;
      color:#9A3837;
      .name{
        font-size:.79rem;
        color:#24160C;
      }

    }
    .bottom{
      width: 100%;
      height:2.81rem;
      position: absolute;
      left:0;
      bottom:0;
      font-size:.26rem ;
      color:#9A3837;
      padding-top:1.1rem;
      box-sizing: border-box;
      time{
        position: absolute;
        left:.95rem;
      }
      .company{
       position: absolute;
       right:.97rem;
     }
   }
 }
</style>
