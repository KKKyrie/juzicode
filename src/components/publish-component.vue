<template>
	<div>
		<div class="top">
			<div class="init">
				<!-- tips start-->
				<div class="alert alert-success tips-success" role="alert">发布成功</div>

				<div class="alert alert-warning tips-warning" role="alert"></div>

				<div class="alert alert-danger tips-error" role="alert"></div>
				<!-- tips end -->

				<span class="limit">{{this.message.length}}/200 字</span>
				<textarea  class="desc"  placeholder="请输入描述性文字（你需要添加至少一个标签，说明代码的语言类型或者领域，如：#javascript#）" rows="5"  maxlength="200" v-model="message"></textarea>
				<div class="mirror">
					<textarea id="code" placeholder="在这里粘贴你的代码"></textarea>
				</div>
				<button class="publish-btn btn btn-primary" v-on:click="publish">发布</button>
			</div>
		</div>

	</div>
</template>

<script>

	const MESSAGE_EMPTY = 'Please输入一段话来描述你的代码';
	const CODE_EMPTY = '拜托，这是代码分享平台诶，不写代码怎么可以Orz...';


	const NO_TAG = '你需要添加至少一个标签，说明代码的语言类型或者领域，如：#javascript#';
	const INCOMPLETE_TAG = '标签不完整，标签必须由两个#分别作为开始和结束 :(';
	const EMPTY_TAG = '标签不能为空 :(';


	export default {
		props:['user'],
		methods: {
			codemirror() {
				var mime="text/x-mysql";
				this.editor = CodeMirror.fromTextArea(document.getElementById('code'), {
					mode: mime,
					indentWithTabs: true,
					smartIndent: true,
					lineNumbers: true,
					styleActiveLine: true,
					matchBrackets : true,
					autofocus: false

				});
			},

			//check users' input whether is empty
			checkEmpty(){


				if (this.message === ''){
					return MESSAGE_EMPTY;
				}else if (this.code === ''){
					return CODE_EMPTY;
				}else{
					return true;
				}
			},

			checkTag(){
				//检测用户是否输入了表示语言种类的标签
				let msg = this.message;
				let begin = msg.indexOf('#');
				let end = msg.lastIndexOf('#');

				//1. 有标签
				//2. 有完整的标签（#*2）
				//3. 两个#内必须有内容
				if (begin === -1){
					return NO_TAG;
				}else if (begin === end){
					return INCOMPLETE_TAG;
				}else if (begin + 1 === end){
					return EMPTY_TAG;
				}

				//内容为空检测
				let tag = $.trim(msg.substring(begin + 1, end));
				if (tag === ''){
					return EMPTY_TAG;
				}

				return true;

			},

			//publish btn click
			publish(){
				let user = this.user;
				this.code = this.editor.getValue();
				console.log(this.code);
				let checkEmptyResult = this.checkEmpty();
				if (checkEmptyResult !== true){
					$('.tips-error').text(checkEmptyResult).show(500).delay(2500).hide(500);
					return;
				}

				let checkTagResult = this.checkTag();
				if (checkTagResult !== true){
					$('.tips-warning').text(checkTagResult).show(500).delay(2500).hide(500);
					return;
				}

				let timeObj = this.getTimeObj();

				let data = {
					//username: "kyrieliu_test_publish",
					username:user,
					description: this.message,
					code: this.code,
					code_id: timeObj.timestamp,
					time: timeObj.date
				};

				let that = this;

				$.ajax({
					url: '/juzicode/php/handle_publish.php',
					type: 'POST',
					data: data,
					async: true,
					timeout: 3000,
					success: function(response){
						if (response === '1'){
							that.$emit('addContent', that.message, timeObj.date, that.code, timeObj.timestamp);
							$('.tips-success').show(500).delay(1000).hide(500);

							that.message = '';
							that.code = '';
							that.editor.setValue('');
						} else {
							console.error(response);
							$('.tips-error').text(response).show(500).delay(1000).hide(500);
						}

					},
					error: function(){
						console.warn('publish error');
						$('.tips-error').text('Oops,发布失败了，再试试看？').show(500).delay(2000).hide(500);
					}
				});

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

			checkMessageCount(){
				let count = this.message.length;

				if (count >= 100){
					$('.limit').css({color: 'orange'});
				} else {
					$('.limit').css({color: 'grey'});
				}
			}


		},

		mounted:function() {
			this.codemirror();
		},

		updated(){
			this.checkMessageCount();
		},

		data:function(){
			return{
				message: '',
				code: ''
			}
		}
	}


</script>

<style scoped>

	.top{

		border: 1px solid #ccc;
		width:60%;
		margin: auto;

	}
	.init{
		width:70%;
		margin:auto;

	}
	.limit{
		display:block;
		margin-left:90%;
		margin-top:20px;

		font-size: 16px;
		color: grey;
		font-weight: bold;

	}
	.desc{
		display: block;
		width:100%;
		height:70px;
		box-shadow: 0 0 7px #ccc;
		border: 1px solid #ccc;
		margin:2px auto 30px ;
		outline:none;
		resize:none;
		padding: 5px;

	}
	.mirror{
		border: 1px solid #ccc;
		width:100%;
		box-shadow: 0 0 7px #ccc;

	}
	.publish-btn{
		margin-top: 20px;
		margin-left:90%;
		margin-bottom: 10px;
		outline:none;
	}

	.alert{
		display: none;
	}

</style>
