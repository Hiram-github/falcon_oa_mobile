<template>
  <div class="home-view">
    <base-header headerTitle="培训首页" returnName=""></base-header>    
    <main class="main-box">
    </main>
  </div>
</template>
<script>
  import BaseHeader from "@/components/common/BaseHeader";
  export default{
    name:"HomeView",
    components:{
      BaseHeader
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
