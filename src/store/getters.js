const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.nickname,
  realName: state => state.user.realName,
  organId: state => state.user.organId,
  tel: state => state.user.tel,
  userId: state => state.user.userId,
  wxUrl: state => state.user.wxUrl,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  tableSelections: state => state.table.selections,
  menuParentId: state => state.menu.menuParentId,
  orderStatus: state => state.myOrder.orderStatus,
  tabbar: state => state.tabbar.tabbar
}
export default getters
