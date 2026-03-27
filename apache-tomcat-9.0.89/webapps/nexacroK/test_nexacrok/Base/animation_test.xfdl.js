(function()
{
    return function(nexacro, system, trace)
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("test");
            this.set_titletext("New Form");
            if (nexacro.Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new nexacro.Button("ButtonTarget","70","190","200","60",null,null,null,null,null,null,this);
            obj.set_cssclass("energy-btn");
            obj.set_taborder("0");
            obj.set_text("Animation Target");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button00","20","25","100","30",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            obj.set_text("Jello");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button01","130","25","100","30",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            obj.set_text("Shake");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button02","240","25","100","30",null,null,null,null,null,null,this);
            obj.set_taborder("3");
            obj.set_text("Heartbeat");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button03","20","65","100","30",null,null,null,null,null,null,this);
            obj.set_taborder("4");
            obj.set_text("Spin");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button04","130","65","100","30",null,null,null,null,null,null,this);
            obj.set_taborder("5");
            obj.set_text("Gradient");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button05","240","65","100","30",null,null,null,null,null,null,this);
            obj.set_taborder("6");
            obj.set_text("Burst");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button06","20","105","100","30",null,null,null,null,null,null,this);
            obj.set_taborder("7");
            obj.set_text("Multi_1");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button06_00","130","105","100","30",null,null,null,null,null,null,this);
            obj.set_taborder("11");
            obj.set_text("Multi_2");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button06_00_00","240","105","100","30",null,null,null,null,null,null,this);
            obj.set_taborder("12");
            obj.set_text("Multi_3");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button07","385","55","85","50",null,null,null,null,null,null,this);
            obj.set_taborder("8");
            obj.set_text("Pause/Resume");
            this.addChild(obj.name, obj);

            obj = new nexacro.Static("Static00","20","350","200","30",null,null,null,null,null,null,this);
            obj.set_taborder("9");
            obj.set_text("Animation Event Log");
            this.addChild(obj.name, obj);

            obj = new nexacro.TextArea("TextArea00","20","380","860","220",null,null,null,null,null,null,this);
            obj.set_taborder("10");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button08","571","37","120","50",null,null,null,null,null,null,this);
            obj.set_cssclass("icon-spinner");
            obj.set_icon("url(\'theme://images/refresh.png\')");
            obj.set_taborder("13");
            obj.set_text("icon spin");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button09","571","110","120","50",null,null,null,null,null,null,this);
            obj.set_cssclass("trans");
            obj.set_icon("url(\'theme://images/up-arrow.png\')");
            obj.set_taborder("14");
            obj.set_text("icon trans");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new nexacro.Layout("default","Desktop_screen",1280,760,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("animation_test.xfdl", function(nexacro, system, trace) {
        // this.Form_onload = function(obj,e)
        // {
        // 	this.TextArea00.value = "";
        // };

        this.fnLog = function(msg)
        {
        	this.TextArea00.value = this.TextArea00.value + "\n" + msg;
        };

        this.fnRunAnimation = function(anim, option)
        {
        	var target = this.ButtonTarget;

        	target.animation = "none"; //animation 재실행 가능하도록 초기화
        	if(!option) option = "1s ease";
        	target.animation = anim + " " + option;

        	this.fnLog("run : " + anim);
        };

        /* Animation Buttons */

        this.Button00_onclick = function(obj,e)
        {
        	this.fnRunAnimation("jello-vertical-normal");
        };

        this.Button01_onclick = function(obj,e)
        {
        	this.fnRunAnimation("shake-lr-normal");
        };

        this.Button02_onclick = function(obj,e)
        {
        	this.fnRunAnimation("heartbeat");
        };

        this.Button03_onclick = function(obj,e)
        {
        	this.fnRunAnimation("spin", "1s linear infinite");
        };

        this.Button04_onclick = function(obj,e)
        {
        	this.fnRunAnimation("gradientFlow", "3s linear infinite");
        };

        this.Button05_onclick = function(obj,e)
        {
        	this.fnRunAnimation("burst");
        };

        this.Button06_onclick = function(obj,e)
        {
        	this.ButtonTarget.animation = "none";
        	this.ButtonTarget.animation = "jello-vertical-normal 1s ease, shake-lr-normal 1s ease";

        	this.fnLog("run : multi(jello + shake)");
        };

        this.Button06_00_onclick = function(obj,e)
        {
        	this.ButtonTarget.animation = "none";
        	this.ButtonTarget.animation = "spin 3s linear infinite, burst 1s ease";

        	this.fnLog("run : multi(spin + burst)");
        };


        this.Button06_00_00_onclick = function(obj,e)
        {
        	this.ButtonTarget.animation = "none";
        	this.ButtonTarget.animation = "gradientFlow 3s linear infinite, shake-lr-normal 1s ease";

        	this.fnLog("run : multi(gradient + shake)");
        };


        /* Control */

        this.Button07_onclick = function(obj,e)
        {
        	if(this.ButtonTarget.animationPlayState == "")
        		this.ButtonTarget.animationPlayState = "paused";
        	else
        		this.ButtonTarget.animationPlayState = ""; // running

        };

        this.test_onanimationstart = function(obj,e)
        {
        	this.fnLog("onanimationstart == "+"form : " + e.fromreferenceobject.name + "/" + e.eventid + "/" + e.animationname + "/" + e.elapsedtime);
        };

        this.test_onanimationiteration = function(obj,e)
        {
        	this.fnLog("onanimationiteration == "+"form : " + e.fromreferenceobject.name + "/" + e.eventid + "/" + e.animationname + "/" + e.elapsedtime);
        };

        this.test_onanimationend = function(obj,e)
        {
        	this.fnLog("onanimationend == "+"form : " + e.fromreferenceobject.name + "/" + e.eventid + "/" + e.animationname + "/" + e.elapsedtime);
        };

        this.Button08_onclick = function(obj,e)
        {
        	this.Button08.cssclass = "";
        	this.Button08.animationPlayState = "paused";
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onanimationend",this.test_onanimationend,this);
            this.addEventHandler("onanimationiteration",this.test_onanimationiteration,this);
            this.addEventHandler("onanimationstart",this.test_onanimationstart,this);
            this.ButtonTarget.addEventHandler("onclick",this.ButtonTarget_onclick,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
            this.Button01.addEventHandler("onclick",this.Button01_onclick,this);
            this.Button02.addEventHandler("onclick",this.Button02_onclick,this);
            this.Button03.addEventHandler("onclick",this.Button03_onclick,this);
            this.Button04.addEventHandler("onclick",this.Button04_onclick,this);
            this.Button05.addEventHandler("onclick",this.Button05_onclick,this);
            this.Button06.addEventHandler("onclick",this.Button06_onclick,this);
            this.Button06_00.addEventHandler("onclick",this.Button06_00_onclick,this);
            this.Button06_00_00.addEventHandler("onclick",this.Button06_00_00_onclick,this);
            this.Button07.addEventHandler("onclick",this.Button07_onclick,this);
            this.Button08.addEventHandler("onclick",this.Button08_onclick,this);
        };

        this.loadIncludeScript("animation_test.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
