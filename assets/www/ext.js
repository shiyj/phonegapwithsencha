var App = new Ext.Application({
    name: 'MapApp',
    useLoadMask: true,
    launch: function () {
	
	
	MapApp.views.mapTopToolbar = new Ext.Toolbar({
         title: 'Map',
         items: [
             {
                 text: 'Home',
                 ui: 'back',
                 handler: function () {
                     
                 }
             },
             { xtype: 'spacer' },
             {
                 text: 'Save',
                 ui: 'action',
                 handler: function () {
                 }
             }
         ]
     });
	MapApp.views.doMap = new Ext.Toolbar({
		layout: {
	        type: 'vbox',
	        pack: 'center',
	        align: 'stretch'
	    },
	    dock: 'bottom',
	    cls: 'card2',
	    scroll: 'vertical',
	    defaults: {
	        layout: {
	            type: 'hbox'
	        },
	        flex: 1,
	        defaults: {
	            xtype: 'button',
	            cls: 'demobtn',
	            flex: 1
	        }
	    },
	    items:[
	            { 
	            	ui: 'confirm', 
	            	text: '开始吧！！！',
	            	handler: function () {
	            		MapApp.views.container.setActiveItem('mapPanel', { type: 'slide', direction: 'left' });
	            	}	
	            }]
    });
	
	MapApp.views.mapPanel = new Ext.Panel({
		id: 'mapPanel',
		fullscreen: true,
        layout: 'card',
        cardAnimation: 'slide',
		dockedItems: [{
			xtype: 'component',
			fullscreen: true,
			layout: 'fit',
			dock: 'center',
            id: 'map',
			
            listeners: {
               render: function(){
				init();
				watch();
				}
			}
			},{
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
	        	text: '返回',
                ui: 'back',
                handler: function () {
	        		MapApp.views.container.setActiveItem('tabPanel', { type: 'slide', direction: 'right' });
                }
	        	}, {
	        	text: '撤销',
                ui: 'action',
                handler: function () {
	        		undo();
	        		}
	        	}, {
	        	text: '恢复',
                ui: 'action',
                handler: function () {
	        		redo();
                	}
	        	}, {
	        	text: '踩点',
                ui: 'action',
                handler: function () {
                		setgeo();
	        		}
	        	}, {
	        	text: '完成',
                ui: 'action',
                handler: function () {
	        		finish();
                	}
	        	}]
	    }],
		
	});
	
	MapApp.views.tabPanel = new Ext.TabPanel({
		id: 'tabPanel',
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
            html:'<h1>地图操作规范</h1><p>地图编辑后记得点击完成才行哦……</p>',
            cls: 'card2',
            dockedItems: [MapApp.views.mapTopToolbar,MapApp.views.doMap]
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
	
	
	MapApp.views.container= new Ext.Panel({
        fullscreen: true,
        layout: 'card',
        cardAnimation: 'slide',
        items: [MapApp.views.tabPanel,MapApp.views.mapPanel]
    })
	}
})