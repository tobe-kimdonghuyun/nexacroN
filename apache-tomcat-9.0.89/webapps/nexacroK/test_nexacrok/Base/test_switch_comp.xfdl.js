(function()
{
    return function(nexacro, system, trace)
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("test_switch_comp");
            this.set_titletext("New Form");
            if (nexacro.Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new nexacro.Switch("Switch00","370","16","220","82",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_text("switch_comp");
            this.addChild(obj.name, obj);

            obj = new nexacro.TextArea("TextArea00","600","15","292","385",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button00","42","16","141","38",null,null,null,null,null,null,this);
            obj.set_taborder("2");
            obj.set_text("canchange-return변경");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button01","185","16","97","38",null,null,null,null,null,null,this);
            obj.set_taborder("3");
            obj.set_text("textposition 변경");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button02","283","16","74","38",null,null,null,null,null,null,this);
            obj.set_taborder("4");
            obj.set_text("bartype변경");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button03","42","60","137","38",null,null,null,null,null,null,this);
            obj.set_taborder("5");
            obj.set_text("switchbuttonwidth 변경");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button04","183","60","144","38",null,null,null,null,null,null,this);
            obj.set_taborder("6");
            obj.set_text("truevalue,falsevalue 변경");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button05","42","160","105","38",null,null,null,null,null,null,this);
            obj.set_taborder("7");
            obj.set_text("setSelectedStatus");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button06","156","160","130","38",null,null,null,null,null,null,this);
            obj.set_taborder("8");
            obj.set_text("toggleSelectedStatus");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button07","42","203","105","34",null,null,null,null,null,null,this);
            obj.set_taborder("9");
            obj.set_text("getSelectedStatus");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button08","44","110","134","35",null,null,null,null,null,null,this);
            obj.set_taborder("10");
            obj.set_text("keydown return값변경");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button09","184","110","136","35",null,null,null,null,null,null,this);
            obj.set_taborder("11");
            obj.set_text("keyup return값 변경");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button10","902","17","69","37",null,null,null,null,null,null,this);
            obj.set_taborder("12");
            obj.set_text("clear");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button11","298","164","62","34",null,null,null,null,null,null,this);
            obj.set_taborder("13");
            obj.set_text("readonly");
            this.addChild(obj.name, obj);

            obj = new nexacro.Button("Button12","369","165","68","33",null,null,null,null,null,null,this);
            obj.set_taborder("14");
            obj.set_text("disabled");
            this.addChild(obj.name, obj);

            obj = new nexacro.Edit("Edit00","203","263","146","43",null,null,null,null,null,null,this);
            obj.set_readonly("true");
            obj.set_taborder("15");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new nexacro.Layout("default","",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("test_switch_comp.xfdl", function(nexacro, system, trace) {

        var _var_canchange = true

        this.Switch00_canchange = function(obj,e)
        {
        	this.TextArea00.insertText("\n event: canchange return값: " + _var_canchange)
        	return _var_canchange
        };

        this.Switch00_onchanged = function(obj,e)
        {
        	this.TextArea00.insertText("\n event: onchanged value: " + this.Switch00.value)

        };

        this.Switch00_onclick = function(obj,e)
        {
        	this.TextArea00.insertText("\n event: onclick")
        };

        this.Switch00_onkeydown = function(obj,e)
        {
        	this.TextArea00.insertText("\n event: onkeydown")

        	return _keydown_status
        };

        this.Switch00_onkeyup = function(obj,e)
        {
        	this.TextArea00.insertText("\n event: onkeyup")

        	return _keyup_status
        };

        this.Button00_onclick = function(obj,e)
        {
        		_var_canchange = !_var_canchange
        };

        var _position_idx = 0
        this.Button01_onclick = function(obj,e)
        {
        	if (_position_idx % 3 == 0)
        		this.Switch00.textposition = "left"
        	else if (_position_idx % 3 == 1)
        		this.Switch00.textposition = "right"
        	else
        	{
        		this.Switch00.textposition = "error"
        		_position_idx = 0
        	}

        	_position_idx++

        	this.TextArea00.insertText("\n textposition: "+this.Switch00.textposition)
        };

        var _bartype_idx = 0
        this.Button02_onclick = function(obj,e)
        {
        	if (_bartype_idx % 4 == 0)
        		this.Switch00.bartype = "inner"
        	else if (_bartype_idx % 4 == 1)
        		this.Switch00.bartype = "line"
        	else if (_bartype_idx % 4 == 2)
        	{
        		this.Switch00.bartype = "fit"
        	}
        	else
        	{
        		this.Switch00.bartype = "error"
        		_bartype_idx = 0
        	}
        	_bartype_idx++

        	this.TextArea00.insertText("\n bartype:" +  this.Switch00.bartype)
        };

        var _button_width_idx = 0
        this.Button03_onclick = function(obj,e)
        {
        	var arr_val = ['0', '-1', '100', '가', '150', '+']

        	this.Switch00.switchbuttonwidth = arr_val[_button_width_idx++]
        	this.TextArea00.insertText("\n switchbuttonwidth:" +  this.Switch00.switchbuttonwidth)

        	if (_button_width_idx >= arr_val.length) _button_width_idx = 0

        };

        var _value_idx = 0
        this.Button04_onclick = function(obj,e)
        {

        	this.Switch00.truevalue = "11"
        	this.Switch00.falsevalue = "22"

        	this.TextArea00.insertText("\n truevalue:" +  this.Switch00.truevalue +" , falsevalue: "+ this.Switch00.falsevalue)
        };

        var _status = true
        this.Button05_onclick = function(obj,e)
        {
        	this.Switch00.setSelectStatus(_status)
        	this.TextArea00.insertText("\n setSelectStatus:" +  _status)
        	_status = !_status
        };

        this.Button06_onclick = function(obj,e)
        {
        	var ret = this.Switch00.toggleSelectStatus()
        	this.TextArea00.insertText("\n ret: "+ret + ", getSelectStatus:" +  this.Switch00.getSelectStatus())
        };

        this.Button07_onclick = function(obj,e)
        {
        	this.TextArea00.insertText("\n getSelectStatus:" +  this.Switch00.getSelectStatus())
        };

        var _keydown_status = true
        this.Button08_onclick = function(obj,e)
        {
        	_keydown_status = !_keydown_status
        };

        var _keyup_status = true
        this.Button09_onclick = function(obj,e)
        {
        	_keyup_status = !_keyup_status
        };

        this.test_switch_comp_onkeydown = function(obj,e)
        {
        	this.TextArea00.insertText("\n event: form_onkeydown:")
        };

        this.test_switch_comp_onkeyup = function(obj,e)
        {
        	this.TextArea00.insertText("\n event: form_onkeyup:")
        };

        this.Button10_onclick = function(obj,e)
        {
        	this.TextArea00.value = ''
        };

        this.Button11_onclick = function(obj,e)
        {
        	this.Switch00.readonly = true
        };

        this.Button12_onclick = function(obj,e)
        {
        	this.Switch00.enable = false
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onkeydown",this.test_switch_comp_onkeydown,this);
            this.addEventHandler("onkeyup",this.test_switch_comp_onkeyup,this);
            this.Switch00.addEventHandler("canchange",this.Switch00_canchange,this);
            this.Switch00.addEventHandler("onchanged",this.Switch00_onchanged,this);
            this.Switch00.addEventHandler("onclick",this.Switch00_onclick,this);
            this.Switch00.addEventHandler("onkeydown",this.Switch00_onkeydown,this);
            this.Switch00.addEventHandler("onkeyup",this.Switch00_onkeyup,this);
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
            this.Button01.addEventHandler("onclick",this.Button01_onclick,this);
            this.Button02.addEventHandler("onclick",this.Button02_onclick,this);
            this.Button03.addEventHandler("onclick",this.Button03_onclick,this);
            this.Button04.addEventHandler("onclick",this.Button04_onclick,this);
            this.Button05.addEventHandler("onclick",this.Button05_onclick,this);
            this.Button06.addEventHandler("onclick",this.Button06_onclick,this);
            this.Button07.addEventHandler("onclick",this.Button07_onclick,this);
            this.Button08.addEventHandler("onclick",this.Button08_onclick,this);
            this.Button09.addEventHandler("onclick",this.Button09_onclick,this);
            this.Button10.addEventHandler("onclick",this.Button10_onclick,this);
            this.Button11.addEventHandler("onclick",this.Button11_onclick,this);
            this.Button12.addEventHandler("onclick",this.Button12_onclick,this);
        };

        this.loadIncludeScript("test_switch_comp.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
