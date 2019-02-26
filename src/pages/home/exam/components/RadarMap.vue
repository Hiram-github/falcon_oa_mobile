<template>
  <div class="radar-map" ref="radarMap">
    <!-- <no-data v-show="isRaderNoData"></no-data> -->
    <!-- <canvas v-show="!isRaderNoData" id="chart-view" ref="chartView"></canvas> -->
    <canvas id="chart-view" ref="chartView"></canvas>
  </div>
</template>
<script>
  import NoData from "@/components/common/NoData";//公共无数据提示组件
  export default{
    name:"RadarMap",
    components: {
      NoData
    },
    data(){
      return {
        chartObj:null,
        knowAnalList:[],
        raderList:[],
        isRaderNoData:true,
        diagnoseNum:0
      }
    },
    props:{
      examId:{
        type:String,
        require:true
      }
    },
    mounted(){
      const self=this
      self.getKnowledgeAnalysis().then(()=>{
        self.setBaseData()
        if(self.isRaderNoData)
          return
        self.setChartWH()
        self.initChart()
      })
    },
    destroyed(){
    },
    methods:{
        /**
        *  @Description: 拼接设置知识点数值 （Ant f2 api只找到这一个实例，故采用原始方式拼接）
        *  @Author: ykl
        **/
        setBaseData(){
          const self=this
          self.raderList=[];
          for(let i=0;i<self.knowAnalList.length;i++){
            let item=self.knowAnalList[i]
            let pointObj={}
            pointObj.name=item.knowledge_point.point_name
            pointObj.value=item.person_score
            self.diagnoseNum+=item.person_score
            self.raderList[i]=pointObj
          }

          if(self.raderList.length>0)
            self.isRaderNoData=false
          else
            self.isRaderNoData=true
        },
        /**
         *  @Description: 获取试知识点分析
         *  @Author: ykl
         **/
         getKnowledgeAnalysis(){
          const self=this
          let promise = new Promise((resolve, reject)=>{
            let url = "exam/performance/get_knowledge_point_analysis"
            let requestData = {
              plan_id: self.examId
            }
            self.$http.post(url, requestData).then(res => {
              if(res.code==200){
                self.knowAnalList=res.data.instance
                resolve()
              }
            }).catch(err => {
              reject()
            }) 
          })
          return promise
        },
        setChartWH(){
          const self=this;
          let parentHeight = self.$refs.radarMap.offsetHeight
          let parentWidth = self.$refs.radarMap.offsetWidth
          self.$refs.chartView.width = parentWidth*1.3
          self.$refs.chartView.height = parentHeight
        },
        initChart(){
          const self=this;
          self.chartObj = new F2.Chart({
            id: "chart-view",
            pixelRatio: window.devicePixelRatio
          });
          self.chartObj.source(self.raderList, {
            /*value: {
              min: 0,
              max: 100
            }*/
          });
          self.chartObj.coord('polar');
        self.chartObj.tooltip(false); // 关闭 tooltip
        self.chartObj.axis('value', {
          grid: {
            lineDash: null
          },
          label: null,
          line: null
        });
        self.chartObj.axis('name', {
          grid: {
            lineDash: null
          }
        });
        self.chartObj.area().position('name*value').color('#00FF00').style({
          fillOpacity: 0.2
        }).animate({
          appear: {
            animation: 'groupWaveIn'
          }
        });
        self.chartObj.line().position('name*value').color('#00FF00').size(1).animate({
          appear: {
            animation: 'groupWaveIn'
          }
        });
        self.chartObj.point().position('name*value').color('#00FF00').animate({
          appear: {
            delay: 300
          }
        });

        self.chartObj.guide().html({
          position: ['50%', '50%'],
          html: '<div v-show="isRaderNoData" style="color: #00FF00;white-space: nowrap;text-align:center;">' + '<p style="font-size: .12rem;margin:0;">诊断分</p>' + '<p style="font-size: .32rem;margin:0;font-weight: bold;">'+self.diagnoseNum+'</p>' + '</div>'
        });
        self.chartObj.render();
      }
    }
  }
</script>
<style lang="scss" scoped>
.radar-map{
  @include widthAndHeight(100%,100%);
  @include flexAndChildAlign(center);
}
</style>
