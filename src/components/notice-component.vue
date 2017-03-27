<template>
	<div class="notice">
		<span class="username">{{ item.sender }}</span> 评论了你的状态 "&nbsp;<p class="content-desc">{{ item.desc }}</p>"：
		<br />
		<p class="comment">{{ item.content }}</p>
        <p class="time">{{ item.time }}</p>
	</div>
</template>

<script>
	export default{
		props: ['item'],

        methods: {

        }
	}
</script>

<style scoped>
	.notice{
        width:80%;
        border:1px solid #ccc;
        box-shadow: 0 0 7px #ccc;
        border-radius:8px;
        margin:20px auto;
        position: relative;
        padding-left: 15px;
        padding-top: 5px;
        padding-right: 15px;
    }

    .username{
    	font-weight: bold;
    	cursor: default;

    }

    .content-desc{
    	color: gray;
    	max-width: 150px;
    	display: inline-block;
        margin-bottom: -5px;
    	/*取的时候控制字数，超过100字按一百字算，后加省略号*/
    	overflow: hidden;
    	white-space: nowrap;
    	text-overflow: ellipsis;
    }

    .comment{
    	margin-top: 10px;
    	background-color: #ccc;
    	width: 600px;
    	position: relative;
    	left: 50%;
    	transform: translateX(-300px);
    	padding: 3px 10px;
    }

    .time{
        color: gray;
        font-size: 10px;
        position: relative;
        left: 50%;
        transform: translateX(-300px);
        width: 600px;
    }
</style>