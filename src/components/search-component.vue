<template>
	<div class="search">

		<div ref="fail" class="alert alert-danger" role="alert" style="display: none; text-align: center">您还未输入关键字</div>
		<input type="text" placeholder="请输入关键字" class="soso" maxlength="50" v-model="words" name="searchTxt" value="" v-on:keyup.enter="search"/>
		<span class="limit_words" >&nbsp;{{this.words.length}}/50 字</span>
		<button class="sub  btn btn-success" type="submit" v-on:click="search">搜索</button>
	</div>
</template>

<script>
		export default{
			methods: {
				checkWordsCount(){
					let length = this.words.length;

					if (length >= 25) {
						$('.limit_words').css({color: 'orange'});
					} else {
						$('.limit_words').css({color: 'grey'});
					}
				},

				search:function() {
					var txt = BASE64.encoder($.trim(this.words));

					if (!txt) {
						$(this.$refs.fail).show(500).delay(1500).hide(500);
						return;
					}
					else {
						console.log(txt);
						let that = this;
						$.ajax({
							url: '/juzicode/php/handle_search.php',
							type: 'post',
							dataType: 'json',
							data: {searchTxt: txt},
							success: function (response) {

								console.log(response);
								that.$emit('searchContent', response);

							},
							error: function () {
								console.log("error");
							}
						})
					}


				}

				},

				updated(){
					this.checkWordsCount();
				},


			data:function(){
				return {
					words:'',
					codeList:[],

				}
			}
		}
</script>

<style scoped>
	
	.search{
		width:60%;
		margin: auto;
		margin-bottom: 30px;
		margin-top: 20px;


	}
	.soso{
		display:inline-block;
		box-shadow: 0 0 7px #ccc;
		border: 1px solid #ccc;
		height:30px;
		border-radius:3px;
		width:76%;
		line-height: 30px;
		padding-left: 15px;
		outline:none;

	}
	.limit_words{
		display: inline-block;
		color: grey;
		font-weight: bold;
		margin-left:1%;
		width:6%
	}
	.sub{
		width:8%;
		height:30px;
		line-height: 15px;
		text-align: center;
		border-radius: 5px;
		margin-left: 7%;
		box-shadow: 0 0 7px #ccc;
		border: 1px solid #ccc;



	}
</style>