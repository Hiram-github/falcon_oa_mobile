<template>
  <div class="exam-base-header">
    <base-header :headerTitle=headerTitle :returnName=returnName></base-header>   
    <div class="top">
      <img v-if="sexMnum.WOMAN.flag==userInfo.sex" src="/static/images/oa-mobile/home/user_avtar_01.png" alt=""/>
      <img v-else src="/static/images/oa-mobile/home/user_avtar_02.png" alt=""/>
      <div class="info">
        <div style="display: flex;align-items: center; margin-bottom: .15rem;">
          <strong  class="name">{{userInfo.name}}</strong>
          <div v-if="isShowCeri"class="certification-group" @click="toCertificationList()">
            <img  class="icon" src="/static/images/oa-mobile/home/exam/test_topicon_zhengshu1.png" />
            <img class="icon" src="/static/images/oa-mobile/home/exam/test_topicon_zhengshu2.png" />
            <img class="icon" src="/static/images/oa-mobile/home/exam/test_topicon_zhengshu3.png" />
          </div>
        </div>
        <p>考勤组: 北分值机组</p>
      </div>
    </div>
  </div>
</template>
<script>
  import BaseHeader from "@/components/common/BaseHeader";//公共头组件
  import variables from "@/assets/js/variables.js";//公共变量
  import storage from "@/assets/js/util/storage.js";
  export default{
    name:"HomeView",
    components: {
      BaseHeader
    },
    props:{
      headerTitle:{
        type:String,
        required:true
      },
      returnName:{
        type:String,
        required:true
      }
    },
    data(){
      return {
        isShowCerti:false,//是否显示证书;
        sexMnum:variables.sex,
        userInfo:{
          name:"林镇辉"
        }
      }
    },
    created() {
      const self=this
      let currentPath=self.$route.path
      if(currentPath.indexOf("exam-index")!=-1)
        self.isShowCeri=true
      else
        self.isShowCeri=false


      let userInfo=storage.localStorage.getLoginUserInfo()
      if(!userInfo)
        return
      self.userInfo=userInfo

    },
    destroyed(){

    },
    methods: {
      /**
       *  @Description: 跳转到证书列表
       *  @Author: ykl
       **/
       toCertificationList(){
         const self=this
         self.$router.push({
          path: '/certification-list'
        })
       },

     }
   }
 </script>
 <style lang="scss" scoped>
 .exam-base-header{
  width: 100%;
  display: flex;
}
.top{
  width: 100%;
  height:100%;
  min-height: 1.12rem;
  padding:.82rem 0 0 .25rem;
  background: #fffff;
  display: flex;
  align-items: center;
  >img{
    width: .72rem;
    height: .72rem;
  }
  .info{
    padding-left: .24rem;
    color:#42454B;
    display: flex;
    flex-direction: column;
    .name{
      font-size:.3rem;
    }
    .certification-group{
      margin-left:.26rem;
      display: flex;
      .icon{
        width: .37rem;
        height:.37rem;
      }
    }
    p{
      width: 5.6rem;
      font-size: .24rem;
    }
  }
}

</style>
