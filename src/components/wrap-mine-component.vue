<template>
    <transition name="bounce">
    <div class="wrap">
        <ContentComponent v-for="item in codeList"  :key="item.id" v-bind:content="item" v-on:deleteContent="deleteContent" page="userPage" :username="user"></ContentComponent>
        <p class="loading-hint">正在加载...</p>
    </div>
    </transition>

</template>

<script>

    import ContentComponent from '../components/content-component.vue';
    

    export default{

        props:['user'],

        components : { ContentComponent },

        created(){
            this.getMyCodeList();
            let _this = this;
            var range = 50;             //距下边界长度/单位px
            var totalheight = 0;
            /*函数节流：http://www.alloyteam.com/2012/11/javascript-throttle/#prettyPhoto*/
            var throttle = function(fn, delay, mustRunDelay){
                var timer = null;
                var t_start;
                return function(){
                    var context = this, args = arguments, t_curr = +new Date();
                    clearTimeout(timer);
                    if(!t_start){
                        t_start = t_curr;
                    }
                    if(t_curr - t_start >= mustRunDelay){
                        fn.apply(context, args);
                        t_start = t_curr;
                    }
                    else {
                        timer = setTimeout(function(){
                            fn.apply(context, args);
                        }, delay);
                    }
                };
            };
            window.onscroll=throttle(function() {
                var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
                let username=_this.user;
                if(($(document).height()-range) <= totalheight) {

                    $.ajax({
                        url: '/juzicode/php/handle_mycodeList.php',
                        type: 'GET',
                        data: {
                            user:username,
                            pageNo: _this.pageNo
                        },
                        success: function(response){

                          let res_arr = JSON.parse(response);
                          if (res_arr.length === 0){
                            window.onscroll = null;
                            $('.loading-hint').text('—————— 已加载完你的全部分享 ——————');
                            return;
                          }

                          _this.codeList = _this.codeList.concat(res_arr);
                          _this.pageNo++;
                        },
                        error: function(){
                            console.log('error!');
                        }
                    });

                }
            },500,3600000);
        },

        methods: {
            addContent(message, date,code,code_id){

                this.codeList.unshift({
                    code_id:code_id,
                    username:this.user,
                    time: date,
                    //comments: [{sender:'user'},{sender:'page'},{sender:'的'}],
                    likeCount: 0,
                    comments: [],
                    description: message,
                    code:code
                });

            },

            deleteContent(code_id){
                //这里的time需要换成时间戳的形式
                // time = '2017-07-07'
                console.log(code_id);
                let that=this;
                $.ajax({
                    url: '/juzicode/php/handle_deleteMycodeList.php',
                    type: 'POST',
                    data:  {
                        'code_id':code_id
                    },
                    async: true,
                    timeout: 3000,
                    success: function(response){
                        if (response ){
                            console.log("delete success");
                            for (let i = 0; i < that.codeList.length; i++){
                                if (that.codeList[i].code_id === code_id){
                                    that.codeList.splice(i, 1);
                                    break;
                                }
                            }
                        }
                    },
                    error:function(){
                            console.log("delete error");

                    }
                });


            },

            getMyCodeList(){
              let that = this;
              let username=this.user;
                     $.ajax({
                             url:'/juzicode/php/handle_mycodeList.php',
                             type: 'GET',
                             // data:,
                             data:{
                                  user:username,
                                  pageNo:1
                             },
                             async: true,
                             success: function(response){
                                 //console.log(response);
                                let res_arr = JSON.parse(response);
                                if (res_arr.length === 0){
                                  $('.loading-hint').text('—————— 你还没有分享过代码 ——————');
                                }
                                if (res_arr.length === 1){
                                  $('.loading-hint').text('—————— 已加载完你的全部分享 ——————');
                                }
                                let codeList_obj = res_arr;
                                that.codeList = codeList_obj;
                             },
                             error: function(){
                                     console.log('error!');
                             }
                    });

            }


        },

        data(){

            let codeList = [];

            return { 
              codeList:codeList,
              pageNo:2
            };
        }

        
    }

</script>

<style scoped>

    .wrap{
        margin:30px auto;
        border:1px solid #ccc;
        padding:20px;
        width:60%;
    }


    .bounce-enter-active {
      animation: bounce-in .5s;
    }
    .bounce-leave-active {
      animation: bounce-out .5s;
    }
    
    @keyframes bounce-in {
      0% {
        transform: scale(0);
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
      }
    }
    
    @keyframes bounce-out {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(0);
      }
    }


    .loading-hint{
        text-align: center;
        font-size: 15px;
        color: gray;
    }


</style>