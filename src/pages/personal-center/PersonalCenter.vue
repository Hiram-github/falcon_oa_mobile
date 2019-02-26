<template>
  <div class="home-view">
    <base-header headerTitle="深圳市天盈隆科技有限公司" returnName=""></base-header>    
    <div class="main-box">
      <not-ready-view></not-ready-view>
    </div>
    <footer-menu></footer-menu>
  </div>
</template>
<script>
  import BaseHeader from "@/components/common/BaseHeader";
  import FooterMenu from "@/components/common/FooterMenu";
  import NotReadyView from "@/components/common/NotReadyView";
  export default{
    name:"HomeView",
    components:{
      BaseHeader,
      FooterMenu,
      NotReadyView
    },
    data(){
      return {
      }
    },
    created () {

    },
    destroyed(){

    },
    methods:{
    }
  }
</script>
<style lang="scss" scoped>
.main-box{
 padding:.82rem 0 1.42rem;
}  
</style>
