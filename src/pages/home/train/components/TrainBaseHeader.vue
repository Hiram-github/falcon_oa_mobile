<template>
  <div class="exam-base-header">
    <base-header :headerTitle=headerTitle :returnName=returnName></base-header>   
    <div class="top">
      <img v-if="sexMnum.WOMAN.flag==userInfo.sex" src="/static/oa-mobile/home/user_avtar_01.png" alt=""/>
      <img v-else src="/static/images/oa-mobile/home/user_avtar_02.png" alt=""/>
      <div class="info">
        <strong class="name">{{userInfo.name}}</strong>
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
        sexMnum:variables.sex,
        userInfo:{
          name:"林镇辉"
        }
      }
    },
    created() {
      const self=this
      let userInfo=storage.localStorage.getLoginUserInfo()
      if(!userInfo)
        return
      self.userInfo=userInfo
    },
    destroyed(){

    },
    methods: {
    }
  }
</script>
<style lang="scss" scoped>
.exam-base-header{
  width: 100%;
}
.top{
  width: 100%;
  height:100%;
  min-height: 1.12rem;
  padding-top:.82rem;
  background: #fffff;
  position: relative;
  img{
    position: absolute;
    width: .72rem;
    height: .72rem;
    bottom:.23rem;
    left:.3rem;
  }
  .info{
    color:#42454B;
    .name{
      position: absolute;
      bottom:.63rem;
      left:1.26rem;
      font-size:.3rem;
    }
    p{
      width: 5.6rem;
      position: absolute;
      bottom:.24rem;
      left:1.26rem;
      font-size: .24rem;
    }
  }
  
}
</style>
