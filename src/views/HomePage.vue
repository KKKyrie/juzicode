<template>
	<div>
		<div class="alert alert-info info" role="alert" style="display: none">你收到了<span class="num"></span>条评论，<router-link to="/notice">点击查看</router-link></div>
		<SearchComponent v-on:searchContent="searchListener"></SearchComponent>
		<PublishComponent v-on:addContent="pageListener" user="someone"></PublishComponent>
		<WrapComponent user="someone" ref='wrapContent'></WrapComponent>

	</div>
</template>

<script>

	import SearchComponent from '../components/search-component.vue';
	import PublishComponent from '../components/publish-component.vue';
	import WrapComponent from '../components/wrap-component.vue'

	export default {
		components: { SearchComponent, PublishComponent, WrapComponent },

		methods: {
			pageListener(message, date, code,code_id){
				this.$refs.wrapContent.addContent(message, date, code,code_id);
			},
			searchListener(searchList){
				this.$refs.wrapContent.searchContent(searchList);
			}
		},

		mounted(){
			let data = {
				type: 'getNotice',
				receiver: 'someone'
			};
			$.ajax({
				url: '/juzicode/php/handle_newNotice.php',
				type: 'GET',
				data: data,
				timeout: 3000,
				async: true,
				success: function(response){
					if (response > 0){
						//hace new notice
						$('.num').text(response);
						$('.info').show(500);
					}
				},
				error: function(){}
			});
		}
	}
</script>

<style scoped>
	.info{
		text-align: center;
	}
</style>