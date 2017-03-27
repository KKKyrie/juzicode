<template>
	<div class="wrap">
		<h2 class="wrap-title">收到的评论</h2>
		<h3 class="hint" v-if="rendered == false">加载中...</h3>
		<h3 class="hint" v-else-if="commentsList.length === 0">—————— 你暂时还没有收到新的评论 ——————</h3>
		<NoticeComponent v-for="item in commentsList" :key="item.id" v-bind:item="item"></NoticeComponent>
	</div>
</template>

<script>
		
	import NoticeComponent from './notice-component.vue';

	export default {
		components: { NoticeComponent },

		methods: {
			getCommentsList(){
				
				let that = this;

				let data = {

					receiver:'someone'

				};
                
                $.ajax({
                    url: '/juzicode/php/handle_notice.php',
                    type: 'GET',
                    data: data,
                    async: true,
                    success: function(response){
                    	response = JSON.parse(response);
                    	console.log(response);
                        that.commentsList = response;
                        that.rendered = true;
                    },
                    error: function(){
                        console.log('error!');
                    }
                });
			}

		},

		created(){
			this.getCommentsList();
		},

		mounted(){


			let data = {
				type: 'readNotice',
				receiver:'someone'
			};

			$.ajax({
				url: '/juzicode/php/handle_newNotice.php',
				type: 'GET',
				data: data,
				async: true,
				timeout: 3000,
				success: function(response){
					if (response == 1){
						console.log('read all messages');
					}else{
						console.error('error occurs: ' + response);
					}
				},
				error: function(response){
					console.error(response);
				}
			});
		},

		data(){

			let commentsList = [];

			let rendered = false;
			
			return { commentsList, rendered };
		}
	};


</script>

<style scoped>
	.wrap{
        margin:30px auto;
        border:1px solid #ccc;
        padding:20px;
        width:60%;
    }

    .wrap-title{
    	font-weight: bold;
    }

    .hint{
    	text-align: center;
    	color: gray;
    	font-size: 20px;
    }
</style>