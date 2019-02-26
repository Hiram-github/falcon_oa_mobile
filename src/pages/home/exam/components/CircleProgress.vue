<template>
  <div class="box">
    <div class="clip" ref="clip">
      <div class="left"  ref="left"></div>
      <div class="right width-none" ref="right"></div>
    </div>
    <div class="num" ref="num">
      {{num}}
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        timeTimerObj:null
      }
    },
    props:{
      totalNum:{
        type:Number,
        required:true
      },
      num:{
        type:Number,
        required:true
      }
    },
    destroyed(){
      const self=this
      if(self.timeTimerObj)
        clearInterval(self.timeTimerObj)
    },
    mounted(){
      const self=this
      let clip = self.$refs.clip,
      left = self.$refs.left,
      right = self.$refs.right,
      num=(self.num / self.totalNum) * 100,
      rotate = num;
      self.timeTimerObj = setInterval(() => {
        // console.log(rotate+" "+num)
        if(rotate >= 100){
          rotate = 0;
          right.classList.add('width-none');
          clip.classList.remove('auto');
        } else if(rotate > 50){
          right.classList.remove('width-none');
          clip.classList.add('auto');
        }
        left.style.transform = 'rotate('+ 3.6*rotate + 'deg)';
        if(rotate==num||rotate==100||rotate==0){
          clearInterval(self.timeTimerObj)
          return;
        }
        rotate++;
      },10)
    }
  }
</script>

<style lang='scss' scoped>
div{
  box-sizing: border-box;
}
.box{
  width: .76rem;
  height: .76rem;
  position: relative;
  background-color: #ccc;
  border-radius: 50%;
}
.num{
  position: absolute;
  top: 50%;
  left: 50%;
  background: #fff;
  border-radius: 50%;
  width: .66rem; 
  height: .66rem;
  transform: translate(-50%, -50%);
  text-align: center;
  line-height: .66rem;
  font-size: .30rem;
}


.clip{
  width: .76rem;
  height: .76rem;
  position: absolute;
  border: .15rem solid #ccc;
  border-radius: 50%;
  clip: rect(0, .76rem,.76rem, .35rem);
}
.left{
  width: .76rem;
  height: .76rem;
  position: absolute;
  border: .15rem solid #3689fe;
  border-radius: 50%;
  clip: rect(0 .35rem .76rem 0);
  top: -.15rem;
  left: -.15rem;
}
.right{
  width: .76rem;
  height: .76rem;
  position: absolute;
  border: .15rem solid #3689fe;
  border-radius: 50%;
  clip: rect(0 .76rem .76rem .35rem);
  top: -.15rem;
  left: -.15rem;
}
.width-none{
  width: 0;
}
.auto{
  clip: auto;
}
</style>