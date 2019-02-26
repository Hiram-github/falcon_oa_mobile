<template>
 <div id="calendar">
   <!-- 年份 月份 -->
   <div class="month">
     <ul>
      <li class="arrow" @click="pickPre(currentYear,currentMonth)">❮</li>
      <li class="year-month">
        <span class="choose-year">{{ currentYear }}年{{ currentMonth }}月</span>
      </li>
      <li class="arrow" @click="pickNext(currentYear,currentMonth)">❯</li>
    </ul>
  </div>
  <!-- 星期 -->
  <ul class="weekdays">
    <li v-for="(item,index) in weekList" :key=index :style="index==5||index==6?'color:red':''">{{item}}</li>
  </ul>
  <!-- 日期 -->
  <ul class="days">
   <li v-for="day in days">
    <!--本月-->
    <span v-if="day.getMonth()+1 != currentMonth" class="other-month">{{ day.getDate() }}</span>
    <span v-else>
      <!--今天-->
      <span v-if="day.getFullYear() == new Date().getFullYear() && day.getMonth() == new Date().getMonth() && day.getDate() == new Date().getDate()" class='active active-today'>{{ day.getDate() }}</span>
      <span v-else :class="getStyle(day.getDate())">{{ day.getDate() }}</span>
    </span>
  </li>
</ul>
<ul class="explain">
  <li class="today"><i></i>今天</li>
  <li class="finish"><i></i>已完成</li>
  <li class="scheduling"><i></i>排班</li>
</ul>
</div>
</template>
<script>
  export default {
    name: 'Calendar',
    data(){
      return {
       weekList:["MON","TUE","WED","THU","FRI","SAU","SUN"],
       currentDay: 1,//当前天
       currentMonth: 1,//当前月
       currentWeek: 1,//当前周
       currentYear: 1970,//当前年
       days: []
     }
   },
   created: function() {
    this.initData(null);
  },
  methods: {
    initData: function(cur) {
      var date;
      cur? date = new Date(cur):date = new Date();

      this.currentDay = date.getDate();
      this.currentYear = date.getFullYear();
      this.currentMonth = date.getMonth() + 1;
     this.currentWeek = date.getDay(); // 1...6,0
     if (this.currentWeek == 0) {
      this.currentWeek = 7;
    }
    var str = this.formatDate(this.currentYear , this.currentMonth, this.currentDay);
    this.days.length = 0;
    // 今天是周日，放在第一行第7个位置，前面6个
    for (var i = this.currentWeek - 1; i >= 0; i--) {
     var d = new Date(str);
     d.setDate(d.getDate() - i);
     this.days.push(d);
   }
   for (var i = 1; i <= 35 - this.currentWeek; i++) {
     var d = new Date(str);
     d.setDate(d.getDate() + i);
     this.days.push(d);
   }
 },
 pickPre: function(year, month) {
    // setDate(0); 上月最后一天
    // setDate(-1); 上月倒数第二天
    // setDate(dx) 参数dx为 上月最后一天的前后dx天
    var d = new Date(this.formatDate(year , month , 1));
    d.setDate(0);
    this.initData(this.formatDate(d.getFullYear(),d.getMonth() + 1,1));
  },
  pickNext: function(year, month) {
    var d = new Date(this.formatDate(year , month , 1));
    d.setDate(35);
    this.initData(this.formatDate(d.getFullYear(),d.getMonth() + 1,1));
  },

  // 返回 类似 2016-01-02 格式的字符串
  formatDate: function(year,month,day){
    var y = year;
    var m = month;
    if(m<10) 
      m = "0" + m;
    var d = day;
    if(d<10) 
      d = "0" + d;
    return y+"-"+m+"-"+d
  },
  getStyle(day){
    // console.log(day);
    if(day>20&&day<27){
      return "active active-scheduling"
    }else if(day>18&&day<20){
      return "active active-finish"
    }
  }
}
}
</script>
<style lang='scss' scoped>
#calendar{
  width:80%;
  margin: 0 auto;
}
/* 头部当前日期相关样式 */
.month {
  width: 100%;
  color:#333333;
  ul {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-between;
    .arrow {
      padding: .2rem .1rem .1rem;
    }
    .arrow:hover {
      background: rgba(100, 2, 12, 0.1);
    }
    li {
      font-size: .3rem;
      // text-transform: uppercase;
      /* letter-spacing: .3rem; */
      .year-month {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
      }
      .year-month:hover {
        background: rgba(150, 2, 12, 0.1);
      }
      .choose-year {
        padding-left: .2rem;
        padding-right: .2rem;
      }
    }
  }
}
/* 星期相关样式 */
.weekdays {
  margin: 0;
  padding: .1rem 0;
  // background-color: #00B8EC;
  display: flex;
  flex-wrap: wrap;
  // color: #FFFFFF;
  color:#000000;
  justify-content: space-around;
  li {
    display: inline-block;
    width: 13.6%;
    font-size:.2rem;
    text-align: center;
  }
}
/* 日期相关样式 */
.days {
  padding: 0;
  background: #FFFFFF;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  li {
    list-style-type: none;
    display: inline-block;
    width: 14.2%;
    text-align: center;
    padding-bottom: .10rem;
    padding-top: .10rem;
    font-size: .2rem;
    color: #000;
    .active{
      padding: .07rem .07rem;
      border-radius: 50%;
      color: #fff;
    }
    .active-today {
      background: #F3B714;
    }
    .active-finish{
      background: #58D161;
    }
    .active-scheduling{
     background: #408FFE;
   }
   .other-month {
    padding: .06rem .1rem;
    color: gainsboro;
  }
}
li:hover {
  background: #e1e1e1;
}
}
.explain{
  display: flex;
  justify-content: space-between;
  margin-top: .1rem;
  font-size:.22rem;
  font-weight:400;
  color:#888888;
  i{
    width: .16rem;
    height: .16rem;
    display: inline-block;
    border-radius:50%;
    margin-right: .1rem
  }
  .today{
    i{
      background: #F3B714;
    }
  }
  .finish{
    i{
      background: #58D161;
    }
  }
  .scheduling{
    i{
      background: #408FFE;
    }
  }
}
</style>
