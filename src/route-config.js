import HomePage from './views/HomePage.vue';
import NoticePage from './views/NoticePage.vue';
import UserPage from './views/UserPage.vue';

export default [
	{
		path: '/',
		component: HomePage
	},{
		path: '/notice',
		component: NoticePage
	},{
		path: '/user',
		component: UserPage
	}
];