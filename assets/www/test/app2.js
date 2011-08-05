

var App = new Ext.Application({
    name: 'MapApp',
    useLoadMask: true,
    launch: function () {

        MapApp.views.mainContainer = new Ext.Panel({
            id: 'mainContainer',
            layout: 'fit',
            dockedItems: [{
                xtype: 'toolbar',
                ui: 'light',
                dock: 'bottom',
                defaults: {
                    iconMask: true,
                    ui: 'plain'
                },
                scroll: {
                    direction: 'horizontal',
                    useIndicators: false
                },
                layout: {
                    pack: 'center'
                },
                items: [{
                    iconCls: 'home',
                    text:'home'
                }, {
                    iconCls: 'settings'
                }, {
                    iconCls: 'maps'
                }, {
                    iconCls: 'user'
                }]
            }],
        });

        MapApp.views.viewport = new Ext.Panel({
            fullscreen: true,
            layout: 'card',
            cardAnimation: 'slide',
            items: [MapApp.views.mainContainer]
        })
    }
});