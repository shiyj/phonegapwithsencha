Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,
    onReady: function() {
        var tabpanel = new Ext.TabPanel({
            tabBar: {
                dock: 'bottom',
                layout: {
                    pack: 'center'
                }
            },
            fullscreen: true,
            ui: 'light',
            cardSwitchAnimation: {
                type: 'slide',
                cover: true
            },
            
            defaults: {
                scroll: 'vertical'
            },
            items: [{
                title: '主面板',
                html: '<h1>Bottom Tabs</h1><p>Docking tabs to the bottom will automatically change their style. The tabs below are type="light", though the standard type is dark. Badges (like the 4 &amp; Long title below) can be added by setting <code>badgeText</code> when creating a tab/card or by using <code>setBadge()</code> on the tab later.</p>',
                iconCls: 'home',
                cls: 'card1'
            }, {
                title: '地图操作',
                iconCls: 'action',
                cls: 'card2',
                dockedItems: [{
                	xtype: 'toolbar',

            }, {
                title: '设置',
                html: '<h1>Settings Card</h1>',
                cls: 'card4',
                iconCls: 'settings'
            }, {
                title: '小组',
                html: '<h1>User Card</h1>',
                iconCls: 'user'
            }]
        });
    }
});