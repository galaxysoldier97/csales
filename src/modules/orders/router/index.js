export default{

    name: 'orders',
    component: () => import('@/modules/Layout.vue'),
    children: [
        {
            path:'',
            name:'orders_index',
            component: () => import(/* webpackChunkName: "orders_index"*/'@/modules/orders/views/index.vue' )
        },
        {
            path:'new',
            name:'orders_create',
            component: () => import(/* webpackChunkName: "orders_create"*/'@/modules/orders/views/create.vue' )
        }, 
        
        {
            path:':id',
            name:'orders_edit',
            component: () => import(/* webpackChunkName: "orders_edit"*/'@/modules/orders/views/edit.vue' )
        }, 
        {
            path:'search',
            name:'orders_search',
            component: () => import(/* webpackChunkName: "orders_search"*/'@/modules/orders/views/search.vue' )
        }, 
        {
            path:'contracts',
            name:'contracts',
            component: () => import(/* webpackChunkName: "contracts"*/'@/modules/orders/views/contracts.vue' )
        }, 

]
}