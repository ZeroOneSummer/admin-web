/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const infoRouter = {
  path: '/basic',
  component: Layout,
  redirect: 'noredirect',
  name: 'Basic',
  meta: {
    title: 'basic',
    icon: 'info'
  },
  children: [
    {
      path: 'merchant',
      component: () => import('@/views/charts/keyboard'),
      name: 'Merchant',
      meta: { title: 'merchant', noCache: true, icon: 'merchant' }
    },
    {
      path: 'dealer',
      component: () => import('@/views/charts/line'),
      name: 'Service',
      meta: { title: 'dealer', noCache: true, icon: 'service' }
    }
  ]
}

export default infoRouter
