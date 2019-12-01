import loadable from '@loadable/component';

const AdminPage = loadable(() => import(/* webpackChunkName: "admin" */ './AdminPage'));

export { AdminPage };
