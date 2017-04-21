var AdminHelper = {};


AdminHelper.adminOrdersPath = () => '/admin/orders';
AdminHelper.adminOrderPath = (id) => `/admin/order/${id}`;
AdminHelper.adminAnalyticsPath = () => '/admin/analytics';

module.exports = AdminHelper;
