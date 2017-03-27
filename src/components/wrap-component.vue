<template>
    <div class="wrap" >
        <ContentComponent v-for="item in codeList"  :key="item.id" v-bind:content="item" :username="user" page="homePage"></ContentComponent>
        <p class="loading-hint">正在加载...</p>
    </div>

</template>

<script>

    import ContentComponent from '../components/content-component.vue';
    export default{

        props:['user'],

        watch: {
            codeList: function(data){
            }
        },
        components : { ContentComponent },

        created(){
            //window.idlist  ={};
            this.getCodeList();
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
            
            window.onscroll = throttle(function() {
                var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos);

                if(($(document).height()-range) <= totalheight) {
                    let searchVal = BASE64.encoder(document.querySelector('.soso').value);
                    let data = {
                        pageNo: _this.pageNo
                    };
                    let url='/juzicode/php/handle_codeList.php';

                    if(searchVal){

                        data = Object.assign(data, {searchTxt: searchVal});

                        url='/juzicode/php/handle_search.php';
                    }

                    $.ajax({
                        url:url,
                        type: 'POST',
                        data: data,
                        success: function(response){
                            //触底处理 @kyrieliu
                            let res_arr = JSON.parse(response);
                            if (res_arr.length === 0){
                                window.onscroll = null;
                                $('.loading-hint').text('—————— 没有更多的分享了 ——————');
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
            addContent(message, date, code, code_id){
                this.codeList.unshift({
                    code_id: code_id,
                    username: this.user,
                    time: date,
                    //comments: [{sender:'新'},{sender:'加'},{sender:'的'}],
                    likeCount: 0,
                    comments: [],
                    description: message,
                    code: code
                });
            },
            searchContent(searchList){

                let _this = this;
                var searchLength = searchList.length;
                console.log(searchLength);
                _this.codeList = [];
                if (searchLength) {
                    setTimeout(function () {
                        _this.codeList = searchList;
                    }, 500)
                }
                else {
                    //alert("没有找到您想要的内容，可能代码不够多。。。。SORRY❤");
                    $('.loading-hint').text('—————— 搜索结果为空 ——————');


                }
            },

            getCodeList()
                {

                    let that = this;
                    $.ajax({
                        url: '/juzicode/php/handle_codeList.php',
                        type: 'POST',
                        timeout: 3000,
                        //pageNo：当前是第几页
                        data: {
                            pageNo: 1
                        },
                        async: true,
                        success: function (response) {
                            let codeList_obj = JSON.parse(response);
                            that.codeList = codeList_obj;
                        },
                        error: function () {
                            console.log('error!');
                        }
                    });

                },
            },



        data: function(){
            return {
                codeList: [],
                pageNo:2
            }
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

    .loading-hint{
        text-align: center;
        font-size: 15px;
        color: gray;
    }


</style>