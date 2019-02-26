<template>
  <vue-drawer-layout :content-drawable="true"  ref="drawerLayout" @mask-click="handleMaskClick" >
    <div  class="drawer" slot ="drawer"> 
      <div class="user-menu">切换</div>
      <div class="user-wrapper">
        <div class="user-wrapper-item">
          <img class="user-img" :src="userImg"/>
          <div class="user-name">
            {{loginUser}}
          </div>
        </div>
      </div>
      <div>
        <mt-radio
        title="功能"
        v-model="selectServer"
        :options="serviceList" @change="updateServer()">
      </mt-radio>
    </div>
    <div class="login-out" @click="loginOut">退出登录</div>
  </div> 
  <div class="content" slot="content">
   <div class="home-view" style="overflow: auto !important">
    <base-header :headerTitle="headerTitle" @showMenu=showMenu() returnName=""></base-header>    
    <div class="main-box">
     <div class="notice">
      <img src="/static/images/oa-mobile/home/zhiji_topicon_msg.png"/>
      <ul :class="{'marquee-left':isAnimate}"><li v-for="(item,index) in noticeList">{{item}}</li></ul>
      <i class="flag">{{noticeList.length}}</i>
    </div>
    <div class="schedule-box">
      <h5 class="title">我的排班</h5>
      <nav class="schedule-btn-box">
        <router-link class="schedule-btn" to="/attendance"><img src="/static/images/oa-mobile/home/zhiji_boxicon_icon1.png" alt=""/><span>考勤</span></router-link>
        <router-link class="schedule-btn" to="/leave"><img src="/static/images/oa-mobile/home/zhiji_boxicon_icon2.png" alt=""/><span>请假</span></router-link>
        <router-link class="schedule-btn" to="/change-shift"><img src="/static/images/oa-mobile/home/zhiji_boxicon_icon3.png" alt=""/><span>调班</span></router-link>
        <router-link class="schedule-btn" to="/overtime"><img src="/static/images/oa-mobile/home/zhiji_boxicon_icon4.png" alt=""/><span>加班</span></router-link>
        <router-link class="schedule-btn" to="/sign-in"><img src="/static/images/oa-mobile/home/zhiji_boxicon_icon5.png" alt=""/><span>补打卡</span></router-link>
        <router-link class="schedule-btn" to="/salary"><img src="/static/images/oa-mobile/home/zhiji_boxicon_icon6.png" alt=""/><span>工资</span></router-link>
      </nav>
    </div>
    <div class="calendar-box">
      <div class="content-left">
        <img src="/static/images/oa-mobile/home/user_avtar_02.png" alt=""/>
        <strong class="name">马晓军</strong>
        <span class="status-text">上班 09:00</span>
        <button class="status-btn">迟到</button>
        <span class="status-text">下班 18:00</span>
        <button class="status-btn">待打卡</button>
      </div>
      <div class="content-right">
        <calendar></calendar>
      </div>
    </div>
    <div class="exam-box">
      <h5 class="title">我的考试</h5>
      <nav class="exam-btn-box">
        <router-link class="exam-btn" to="/exam-notice"><img src="/static/images/oa-mobile/home/zhiji_testicon1.png" alt=""/><span>当前考试</span></router-link>
        <router-link class="exam-btn" to="/exam-index"><img src="/static/images/oa-mobile/home/zhiji_testicon2.png" alt=""/><span>我的考试情况</span></router-link>
      </nav>
    </div>
    <nav class="training-box">
       <router-link to="/train-index">
        <h5 class="title">我的培训</h5>
        <div class="content">
          <div class="content-left">
            <p>已完成40%</p>
            <div class="out-bar">
              <div class="in-bar"></div>
            </div>
          </div>
          <div class="content-right">2/8</div>
        </div>
      </router-link>
    </nav>
  </div>
  <footer-menu></footer-menu>
</div>
</div>
</vue-drawer-layout> 
</template>
<script>
  import BaseHeader from "@/components/common/BaseHeader";
  import FooterMenu from "@/components/common/FooterMenu";
  import Calendar from "./components/Calendar";
  import storage from "@/assets/js/util/storage.js"
  
  export default{
    name:"HomeView",
    components: {
      BaseHeader,
      FooterMenu,
      Calendar,
    },
    data(){
      return {
          headerTitle:"深圳市天盈隆科技有限公司",
          animateTimerObj:null,//字幕定时器对象
          isAnimate: false,
          noticeList:["值机模块考试功能开发完毕！！！","除考试外，其余功能正在开发中！！！","敬请等待，程序猿正在努力加班中！！！"],
          serviceList: [
          {label:"值机", value:"oa", checked:false},
          {label:"运维", value:"ops", checked:true}
          ],
          selectServer:"oa",
          loginUser: "",
          userImg:"/static/images/oa-mobile/menu_header.png",
        }
      },
      created () {
        const self=this
        self.setUserInfo()
        self.animateTimerObj=setInterval (this.showMarquee, 3000)
        self.setHeaderTitle()

      },
      destroyed(){
        const self=this
        if(self.animateTimerObj)
          clearInterval(self.animateTimerObj)
      },
      methods:{
       setHeaderTitle(){
         const self=this
         let companyName=storage.localStorage.getCompanyName()
         if(companyName)
          self.headerTitle=companyName
       },
       setUserInfo(){
        const self=this
        let userInfo = storage.localStorage.getLoginUserInfo()
        if(!userInfo)
          return
        if(userInfo.user_header_photo)
          self.userImg=userInfo.user_header_photo//设置用户头像
        let name =userInfo.name//用户名
        if(name != undefined)
          self.loginUser = name
        else
          self.loginUser = userInfo.user_name
      },
      updateServer(){
        const self=this
        if(self.value="ops")
          window.location.replace("/ops/home")
      },
      loginOut() {
        const self = this;
        let url = "user/logout";
        let requestData = {};
        self.$http.post(url, requestData).then(res => {
          storage.localStorage.clear()
          window.location.replace("/login/login")
        }).catch(err => {
        })
      },
      showMarquee:function(){
        const self=this
        self.isAnimate = true
        setTimeout (() => {
          self.noticeList.push(self.noticeList[0]);
          self.noticeList.shift();
          self.isAnimate = false;
        }, 500);
      },
      handleMaskClick() {
        const self=this
        self.$refs.drawerLayout.toggle(false);
      },
      showMenu(){
        const self=this
        self.$refs.drawerLayout.toggle(true);
      }
    }
  }
</script>
<style lang="scss" scoped>
 // @import '../../assets/style/mixin';
 .home-view{
  @include widthAndHeight(100%,100vh);
  .main-box{
    background-color:#ffffff;
    overflow: auto;
    padding:.82rem 0 1.42rem;
    .notice{
      @include widthAndHeight(100%,.68rem);
      position:relative;
      background-color:#9fc7fe;
      font-size:.24rem;
      display:flex;
      justify-content: center;
      align-items: center;
      color:#ffffff;
      text-align: center;
      img{ 
        @include widthAndHeight(.40rem,.40rem);
        margin:0 .33rem 0 .24rem;
      }
      ul{
        width:4.99rem;
        height:0.68rem;
        overflow: hidden;
        li{
          line-height:.68rem;
          overflow: hidden;
          text-overflow: ellipsis;/* 超出内容显示为省略号*/
          white-space: nowrap;/*文本不进行换行*/
        }
      }
      .marquee-left {
        transition: all 0.5s;
        margin-top: -1rem
      }
      .flag{
        width: .34rem;
        height: .34rem;
        margin-left:1.04rem;
        right:.34rem;
        background: #F1233B;
        border-radius:.18rem;
        line-height:.34rem;
      }

    }
    .schedule-box{
      width: 100%;
      height:2.2rem;
      background:#CDDFF6;
      padding:.19rem 0 0 .18rem;
      box-sizing: border-box;
      .schedule-btn-box{
        margin-top:.3rem;
        padding:0 .31rem 0 .12rem;
        display: flex;
        justify-content: space-between;
        .schedule-btn{
         width:1rem;
         height:1.2rem;
         background:url("/static/images/oa-mobile/home/zhiji_boxicon_bg1.png") no-repeat;
         background-size:cover;
         display: flex;
         flex-direction: column;
         align-items: center;
         color: #ffffff;
         img{
          width:.5rem;
          height:.5rem;
          margin:.15rem 0 .14rem;
        }
      }
    }
  }
  .calendar-box{
    height: 3.9rem;
    display: flex;
    padding:.11rem  0 .24rem;
    box-sizing: border-box;
    border-bottom:.01rem solid #CDDFF6;
    box-shadow: #DCEBFF 0.1rem 0.07rem 0.1rem;
    .content-left{
      width: 2.03rem;
      padding:.19rem 0 .1rem;
      box-sizing: border-box;
      border-right:.01rem #73A9F5 solid;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items:center;
      img{
        width: .74rem;
        height: .74rem;
      }
      .name{
        color:#333333;
        font-size: .27rem;
        font-weight:bold;
      }
      .status-text{
        color:#888888;
        font-size: .24rem;
      }
      button{
        width:1.2rem;
        height:.4rem;
        color:#ffffff;
        font-size: .24rem;
        text-align:center;
        line-height:.4rem;
        border-radius:.04rem;
      }
      button:nth-child(4){
        background: #F3B714;
      }
      button:nth-child(6){
        background: #CDDFF6;
      }
    }
    .content-right{
      width:5.46rem;
      height: 100%;
    }
  }
  .exam-box{
    width: 100%;
    height:1.8rem;
    margin-top:.25rem;
    padding:.19rem 0 0 .18rem;
    box-sizing: border-box;
    background:#CDDFF6;

    .exam-btn-box{
      margin-top: .32rem;
      .exam-btn{
        img{
          width: .64rem;
          height: .64rem;
          margin-right:.26rem;
        }
      }
      .exam-btn:nth-of-type(1){
        float:left;
        margin-left:.44rem;
        color:#579DFF;
      }
      .exam-btn:nth-of-type(2){
        float:right;
        margin-right: .49rem;
        color:#5DD749;
      }
    }

  }
  .training-box{
    width: 100%;
    height:1.6rem;
    margin-top:.23rem;
    padding:.19rem 0 0 .18rem;
    box-sizing: border-box;
    background:#CDDFF6;
    .content{
      margin-top:.3rem;
      .content-left{
        float:left;
        margin-left:.33rem;
        p{
          font-size:.24rem;
        }
        .out-bar{
          width:3.8rem;
          height: .18rem;
          padding:.02rem;
          box-sizing: border-box;
          background:#FFFFFF;
          margin-top:.16rem;
          .in-bar{
            width:40%;
            height:100%;
            background:#35D41B
          }
        }
      }
      .content-right{
        width:.66rem;
        height:.45rem;
        font-size:.6rem;
        font-weight:normal;
        color:#408FFE;
        float:right;
        margin-right:.4rem;
      }
    }
  }
} 
/*公共标题*/
.title{
  height: .36rem;
  border-left:.06rem solid #3689FE;
  padding-left:.14rem;
  line-height:.36rem;
  font-size:.3rem;
  font-weight:500;
  color:#408FFE;
}
}

.drawer{
  height: 100%;
  background-color: #f5f7fa;
}

/* 侧滑菜单相关样式 */
.user-menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  line-height: .85rem;
  text-align: center;
  background: #fff;
  font-size: .28rem;
  box-shadow: 0 0.1rem 0.3rem 0 rgba(186, 186, 186, .5);
}
.user-wrapper {
  overflow: auto;
  background-color: #fff;
  margin-top: .9rem;
  .user-img{
   width: .88rem;
   height:95%;
   @include borderRadius(50%);
   margin-left: .2rem;
   background-color: #fff;
   border: 1px solid #ddd;
   -webkit-transition: all .2s ease-in-out;
   transition: all .2s ease-in-out;
 }
 .user-wrapper-item {
  width: 100%;
  height: .9rem;
  line-height: .9rem;
  font-size: 7rem;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
}
}
.login-out {
 width: 100%;
 height: 1rem;
 position: absolute;
 bottom: 0;
 left: 0;
 display: block;
 line-height: 1rem;
 text-align: center;
 border-top-width: 1px;
 border-top-style: solid;
 border-top-color: rgb(229, 229, 229);
 color: #f04134;
}

.user-name {
  font-size: .3rem;
  margin-left: .35rem;
  text-overflow: ellipsis;
}

.selected {
  display: inline-block;
  width: .3rem;
  height: .3rem;
  background: url('/static/images/selected.png') no-repeat center;
  background-size: cover;
  float: right;
}
</style>
