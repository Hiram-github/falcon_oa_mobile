<template>
  <div class="hint">
    <h4>{{examInfo.exam_name}}</h4> 
    <p>此次考试{{examInfo.total_score}}分，答题用时最多{{examInfo.exam_limited_time}}分钟，共{{examInfo.exam_paper.question_num}}题</p>
  </div>
</header>
</template>
<script>
  export default{
    name:"ExamPaperItem",
    data(){
      return {
      }
    },
    props:{
      examInfo:{
        type:Object,
        default:{exam_paper:{}},
        required:true,
      }
    },
    mounted(){
    },
    destroyed(){
    },
    methods:{
    }
  }
</script>
<style lang="scss" scoped>
.hint{
 height:100%;
 display: flex;
 flex-direction: column;
 justify-content: space-around;
 h4{
  font-size: .28rem;
  font-weight:400;
  color:#333333;
}
p{
  font-size:.22rem;
  color:#666666;
}
}
</style>
