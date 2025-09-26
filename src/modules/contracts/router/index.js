export default{

    name: 'template_module',
    component: () => import('@/modules/Layout.vue'),
    children: [
        {
            path:'',
            name:'template_module_index',
            component: () => import(/* webpackChunkName: "template_module_index"*/'@/modules/procesos/views/Index.vue' )
        },

]
}