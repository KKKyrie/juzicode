<template>
    <transition name="bounce">
    <div class="content">
        <div class="user">
            <span style="display:none" id="code_id">{{content.code_id}}</span>
            <span class="username" id="content_username">{{content.username}}</span>
            <span class="time">{{content.time}}</span>
        </div>

        <div class="btnArea">
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-danger" data-toggle="modal" :data-target="'#myModal'+content.code_id" v-if="page === 'userPage'" >删除</button>

            <!-- delete modal starts -->
            <div class="modal fade" :id="'myModal'+content.code_id" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title" id="myModalLabel">你要删除这条发布吗？</h4>
                        </div>
                        <div class="modal-body">
                            删除是永久性操作，不可复原，确定删除吗？
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">算了</button>
                            <button type="button" class="btn btn-danger" v-on:click="deleteContent()" data-dismiss="modal" :code_id="content.code_id" >删除</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- delete modal ends -->
        </div>



        <div class="desc_code">
            <textarea class="descrp" readonly>{{content.description}}</textarea>
            <div class="mirror">
                <textarea :id="'code'+content.code_id" class="code" >
                    {{content.code}}
                </textarea>
            </div>

        </div>

        <!-- 互动区 -->
        <div class="interactArea">
            <div class="comment">

                <button class="commentBtn" v-on:click="hidden">
                    <span>{{content.comments.length}}&nbsp;&nbsp;</span>
                    <span class="glyphicon glyphicon-comment" aria-hidden="true"></span>
                </button>

            </div>
            <div class="like" >
                <button class="likeBtn"  v-on:click="like">
                    <span flag="true">{{content.likeCount}}&nbsp;&nbsp;</span>
                    <span class="glyphicon glyphicon-thumbs-up " aria-hidden="false" ></span>
                </button>
            </div>

            <!-- 评论区 -->
            <div class="commentArea" v-if="state=='none'">
                <div ref="empty" class="alert alert-danger" role="alert" style="display: none">评论不能为空 :)</div>
                <div ref="limit" class="alert alert-warning" role="alert" style="display: none">超出评论字数限制 :)</div>
                <div ref="success" class="alert alert-success" role="alert" style="display: none">评论成功 :)</div>
                <div ref="fail" class="alert alert-danger" role="alert" style="display: none">评论失败 :( 再试试看？</div>
                <div class="commentInput" v-if="state">
                    <span class="sender" id="user">{{username}}:&nbsp;&nbsp;</span>

                    <input type="text" placeholder="在这里写下你想对他说的话" class="sendTxt" v-model="commentText" v-on:keyup.enter="sendComment" />
                    <button ref="sendbtn" class="sendbtn btn btn-primary" v-on:click="sendComment" >评论</button>
                </div>
                <div class="commentPanel" v-for="(item,key) in content.comments">

                    <span class="sender">{{content.comments[key].sender}}: </span>
                    <input type="text" :value="content.comments[key].content" readonly class="sendTxt commentTxt" id="defaultTxt" />
                    <span class="commentTime">{{content.comments[key].date}}</span>
                    <div class="sendPanel">
                        <span  v-on:click="remove(key)"  v-if="hideDelete(content.comments[key].sender,username)" class="removeBtn" >删除</span>

                    </div>
                </div>
            </div>
        </div>
    </div>
    </transition>
</template>

<script>

    export default {
        props: ['content','username', 'page'],

        methods: {
            codemirror() {
                let codeWrapper = this.$el.querySelector('.code');
                var mime="text/x-mysql";
                /*  let id="code"+this.content.code_id;
               console.log('111');
                console.log(codeWrapper);
                console.log(document.getElementById(id));
                console.log('222');*/
                this.editor = CodeMirror.fromTextArea(codeWrapper, {
                        mode: mime,
                        indentWithTabs: true,
                        smartIndent: true,
                        lineNumbers: true,
                        styleActiveLine: true,
                        matchBrackets: true,
                        autofocus: true,
                        readOnly: 'nocursor'

                    });



            },

            //点赞，第一次点为增加1第二次点为减少1
            like:function(){
                if(this.flag == "true")
                {
                    this.content.likeCount++;
                    this.flag = "false";
                }
                 else if(this.flag == "false") {
                    this.content.likeCount--;
                    this.flag = "true";
                }else{
                    this.content.likeCount++;
                    this.flag = "false";
                }
              $.ajax({
                  url:"/juzicode/php/handle_likeCount.php",
                  method:'post',
                  dataType:'json',
                  data:
                      {likeCount:this.content.likeCount,
                       code_id:this.content.code_id
                      },
                  success:function(response){
                      if(response=="1")
                      {
                          console.log("update likeCount success");
                      }

                  },
                  error:function(){
                      console.log("update likeCount error");
                  }
              })

            },

            /*
             return {timestamp: '1231221231', date: '2017年3月10日'}
            */
            getTimeObj(){
                let currentTime = new Date();
                let timestamp = currentTime.getTime();

                let year = currentTime.getFullYear();
                let month = currentTime.getMonth() + 1;
                let day = currentTime.getDate();
                let hours = currentTime.getHours().toString();
                let minutes = currentTime.getMinutes().toString();
                let date = year + '年' + month + '月' + day + '日 ' + (hours.length > 1 ? hours : '0' + hours) + ':' + (minutes.length > 1 ? minutes : '0' + minutes);

                return {
                    timestamp, date
                };
            },

            //comment count checking
            checkCommentCount(){
                let len = this.commentText.length;
                return len;
            },
            
            //发送评论
            sendComment:function(){

                if(this.commentText)
                {
                    

                    let sender = this.username;
                    let receiver = this.content.username;
                    let content = this.commentText;
                    let code_id = this.content['code_id'];
                    let timeObj = this.getTimeObj();
                    let time = timeObj.timestamp;
                    let date = timeObj.date;
                    this.time = time;
                    let data= {
                        sender: sender,
                        receiver: receiver,
                        content: content,
                        code_id: code_id,
                        time: time,
                        date: date
                    }

                    let that = this;
                    $.ajax({
                        url: '/juzicode/php/handle_comment.php',
                        type: 'POST',
                        timeout: 3000,
                        data: data,
                        async: true,
                        success: function(response){
                            console.log(response);

                            if (response === '1'){
                                that.content.comments.unshift({
                                    sender: sender,
                                    content: content,
                                    date: date
                                });
                                
                                that.commentText = "";

                                $(that.$refs.success).show(500).delay(1000).hide(500);
                            }else{
                                $(that.$refs.fail).show(500).delay(1000).hide(500);
                            }

                        },
                        error: function(response){
                            console.log('comment error!');
                            console.log(response);
                            $(that.$refs.fail).show(500).delay(1000).hide(500);
                        }
                    });

                    

                }
                else{
                    $(this.$refs.empty).show(500).delay(1000).hide(500);
                }



            },

            
            //删除评论并且减少评论数
            remove:function(key){

                let time=this.content.comments[key].time;
                let sender=this.content.comments[key].sender;
                console.log(time);

                console.log(sender);
               let that=this;
                 $.ajax({
                 url:'/juzicode/php/handle_deleteComments.php',
                 data:{time:time,
                      sender:sender
                 },
                 dataType:'json',
                 type:'post',
                     success:function(response){
                         console.log(response);
                         if(response=="1")
                         {
                            console.log("delete this comment success");
                             if(that.content.comments[key].sender == that.username){
                                 that.content.comments.splice(key,1);
                             }
                         }
                     },
                     error:function(){
                         console.log("delete this comment error");
                     }
                 })



            },
            
            //点击评论组件，判断当前组件状态: block--显示  none--隐藏
            hidden:function(){

                // $('.commentArea').hide(500);

                return this.state = this.state == "block" ? "none" : "block";
            },

            deleteContent: function($event){

                console.log(this.content.code_id);
                let code_id=this.content.code_id;
                this.$emit('deleteContent',code_id);
            },

            hideDelete:function(observer,sender) {
                if(observer == sender)
                {
                    return true;
                }
            }

        },
        mounted:function() {
            this.codemirror();
        },

        updated(){
            let len = this.checkCommentCount();
            if (len >= 50){
                $(this.$refs.limit).show(500);
                $(this.$refs.sendbtn).attr('disabled','true');
            }else{
                $(this.$refs.limit).hide(500);
                $(this.$refs.sendbtn).removeAttr('disabled');
            }

            console.log(1);
        },
     


        data: function () {

            return {
                 state: 'block',
                 commentText: ''

            }
        }

    }

</script>

<style scoped>
    .content{
        width:80%;
        border:1px solid #ccc;
        box-shadow: 0 0 7px #ccc;
        border-radius:8px;
        margin:20px auto;
        position: relative;
    }
    .username  {
        display: block;
        margin-left:4%;
        margin-top:10px;
        font-size:23px;
        color: #2d2d2d;
    }
    .time {
        display: block;
        margin-left:4%;
        margin-top:5px;
        color: #777777;
        font-size:16px;

    }

    .btnArea{
        position: absolute;
        right: 10%;
        top: 15px;
    }

    .desc_code{
        margin:auto;
        width:80%;
       /* border: 1px solid yellow;*/
    }
    .descrp{
        width:100%;
        /*border:1px solid #ccc;*/
        margin-top: 15px;
        margin-bottom: 5px;
        display: block;
        outline:none;
        resize:none;

    }
    .mirror{
        /*border: 1px solid #ccc;*/
        width:100%;
        box-shadow: 0 0 7px #ccc;
        outline:none;
        resize:none;

    }
    .code{
        width:100%;
        height:300px;
        border:1px solid #ccc;
        margin:auto;
        display: block;
        outline:none;
        resize:none;
    }
    .interactArea{
        width:80%;
        margin:auto;
        margin-bottom: 45px;
        margin-top: 15px;



    }
    .comment{
        width:49%;
        height:40px;
        margin:auto;
        display:inline-block;
        border: 1px solid #cccccc;

    }
    .commentBtn{
        display:block;
        margin: auto;
        width:100%;
        height: 100%;
        outline:none;
    }
    .like {
        width:49%;
        height:40px;
        margin:auto;
        display: inline-block;
        border: 1px solid #cccccc;
        float: right;


    }
    .likeBtn{
        display:block;
        margin:  auto;
        width:100%;
        height: 100%;
        outline:none;

    }
    .commentArea{
        width:100%;
        border-top: 1px solid #ccc;
        margin-top: 10px;
    }
    .commentInput{
        margin-left: 2%;
        margin-top: 10px;
        width:90%;
        line-height: 40px;
        display: flex;
        -webkit-display: flex;
        justify-content: center;
    }
    .commentPanel{
        margin-left:5%;
        margin-top: 10px;
        width:90%;
        border-top:1px solid #ccc;
        line-height: 40px;
        margin-bottom: 15px;
        position: relative;
    }

    .commentTime{
        position: absolute;
        top: 30px;
        left: 0px;
        color: grey;
    }

    .removeBtn{
        cursor: pointer;
    }

    .sender{
        margin-left: 0;
        line-height: 30px;

    }
    .sendTxt{
        width:70%;
        box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.15);
        height:30px;
        line-height:30px;
        outline:none;
    }

    .sendTxt:focus{
        box-shadow: 0px 0px 3px 0px skyblue;
    }

    .commentTxt{
        box-shadow: 0px 0px 0px 0px;
    }

    .sendbtn{
        width:8%;
        height:30px;
        border:1px solid #ccc;
        outline: none;
        font-size: 10px;
        margin-left: 5px;
    }
    .sendPanel{
        width:13%;
        height:30px;
        line-height: 30px;
        margin-left:77%;
        margin-bottom: 15px;

    }


    /*animation*/
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

</style>