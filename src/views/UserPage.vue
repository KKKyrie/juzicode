<!-- @kyrieliu -->

<template>
	<div>
		<div class="button-area">
			<button class="btn btn-success" id="postBtn" v-on:click="postNew">发布</button>
			<button class="btn btn-danger" id="cancelBtn" v-on:click="cancelPost">取消</button>
		</div>
		<PublishComponent id="publish-box"   v-if="flag" v-on:addContent="pageListener" user="someone"></PublishComponent>
		<hr />
		<WrapMineComponent user="someone" ref="wrapMineContent" ></WrapMineComponent>

	</div>
</template>


<script>

	
	import PublishComponent from '../components/publish-component.vue';
	import WrapMineComponent from '../components/wrap-mine-component.vue';


	export default {

		components: { PublishComponent, WrapMineComponent },
		methods: {
			postNew(){
				$('#publish-box').show(300);
				$('#cancelBtn').show(300);
				this.flag=true;
			},
			cancelPost(){
				$('#publish-box').hide(300);
				$('#cancelBtn').hide(300);
				$('#postBtn').show(300);
			},
			pageListener(message, date, code, code_id){
				console.log('userPage knows PublishComponent');
				this.$refs.wrapMineContent.addContent(message, date,code,code_id);
			}


		},

		data:function(){
			return {
				flag:false
			}
		}
	};


</script>



<style scoped>
	.button-area{
		/*border: 1px solid black;*/
		display: flex;
		justify-content: flex-end;
		margin-top: 20px;
	}

	#publish-box{
		animation: bounce-in .5s;
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
	
	#postBtn{
		margin-right: 10px;
	}

	#cancelBtn{
		display: none;
		margin-right: 20px;
	}
</style>