<template>
  <time class="current-time">当前时间:{{currentTime}}</time>
</template>
<script>
   import variables from "@/assets/js/variables.js";//公共变量
   import {formatDateTime} from "@/assets/js/util/page-util.js";
   export default{
    name:"current-time",
    data(){
      return {
        currentTime: "2019年1月8日 21:00:00",
        timeTimerObj:null,//时间定时器对象
        timeFormatMnum:variables.dateType
      }
    },
    created () {
      const self=this
      self.currentTime = formatDateTime(new Date(),self.timeFormatMnum.FONT_FORMAT.flag);//年/月/日 时:分:秒  防止进入界面时，定时没刷新，出现闪烁
      self.timeTimerObj=setInterval(() => {
        self.currentTime = formatDateTime(new Date(),self.timeFormatMnum.FONT_FORMAT.flag);//年/月/日 时:分:秒
      }, 1000)
    },
    destroyed(){
      const self=this
      if(self.timeTimerObj)
        clearInterval(self.timeTimerObj)
    },
    methods:{
    },
  }
</script>
<style lang="scss" scoped>
.current-time{
  font-size:.22rem;
  color:#888888;
}
</style>
