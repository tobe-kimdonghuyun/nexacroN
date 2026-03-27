(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        this.on_create = function()
        {
            // Declare Reference
            var obj = null;
            
            if (Form == this.constructor) {
                this.set_name("ExcelImport");
                this.set_titletext("Excel Import");
                this._setFormPosition(0,0,760,430);
            }

            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("ds_excel", this);
            obj.set_firefirstcount("0");
            obj.getSetter("firenextcount").set("0");
            obj.set_useclientlayout("false");
            obj.set_updatecontrol("true");
            obj.set_enableevent("true");
            obj.set_loadkeymode("keep");
            obj.set_loadfiltermode("keep");
            obj.set_reversesubsum("false");
            obj._setContents("<ColumnInfo><Column id=\"dept_code\" type=\"STRING\" size=\"256\"/><Column id=\"dept_name\" type=\"STRING\" size=\"256\"/><Column id=\"employee\" type=\"STRING\" size=\"256\"/><Column id=\"telno\" type=\"STRING\" size=\"256\"/><Column id=\"address\" type=\"STRING\" size=\"256\"/><Column id=\"age\" type=\"STRING\" size=\"256\"/></ColumnInfo>");
            this.addChild(obj.name, obj);


            
            // UI Components Initialize
            obj = new Button("Button02", "absolute", "648", "42", "101", "28", null, null, this);
            obj.set_taborder("6");
            obj.set_text("File Open");
            this.addChild(obj.name, obj);

            obj = new Static("Static05", "absolute", "16", "15", "283", "15", null, null, this);
            obj.set_taborder("9");
            obj.set_text("Excel Import");
            obj.set_cssclass("sta_WF_subtitP");
            this.addChild(obj.name, obj);

            obj = new Grid("gd_excel", "absolute", "16", "42", "626", "214", null, null, this);
            obj.set_taborder("10");
            obj.set_binddataset("ds_excel");
            obj.set_selecttype("cell");
            obj.set_autoenter("select");
            obj._setContents("<Formats><Format id=\"default\"><Columns><Column size=\"68\"/><Column size=\"184\"/><Column size=\"80\"/><Column size=\"97\"/><Column size=\"101\"/><Column size=\"80\"/></Columns><Rows><Row size=\"24\" band=\"head\"/><Row size=\"24\"/></Rows><Band id=\"head\"><Cell text=\"dept_code\"/><Cell col=\"1\" text=\"dept_name\"/><Cell col=\"2\" text=\"employee\"/><Cell col=\"3\" text=\"telno\"/><Cell col=\"4\" text=\"address\"/><Cell col=\"5\" text=\"age\"/></Band><Band id=\"body\"><Cell edittype=\"normal\" text=\"bind:dept_code\"/><Cell col=\"1\" style=\"align:left;\" text=\"bind:dept_name\"/><Cell col=\"2\" style=\"align:left;\" text=\"bind:employee\"/><Cell col=\"3\" style=\"align:left;\" text=\"bind:telno\"/><Cell col=\"4\" style=\"align:left;\" text=\"bind:address\"/><Cell col=\"5\" text=\"bind:age\"/></Band></Format></Formats>");
            this.addChild(obj.name, obj);


            
            // Layout Functions
            //-- Default Layout
            obj = new Layout("default", "", 760, 430, this,
            	//-- Layout function
            	function(p) {
            		p.set_classname("Main");
            		p.set_titletext("Excel Import");

            	}
            );
            this.addLayout(obj.name, obj);


            
            // BindItem Information

            
            // Remove Reference
            obj = null;
        };
        

        
        // User Script
        this.registerScript("ExcelImport.xfdl", function(exports) {

        this.url = "http://localhost:6060/nexacro_xeni_jakarta_20251223(2.0.5)_1/XExportImport";
        this.importObj = null;

        this.Button02_onclick = function(obj,e)
        {
        	if(this.importObj == null){
        		this.importObj = new nexacro.ExcelImportObject("Import00",this);	
        		this.importObj.set_importtype(nexacro.ImportTypes.EXCEL);
        		this.importObj.addEventHandler("onsuccess", this.Import00_onsuccess, this);
        		this.importObj.addEventHandler("onerror", this.Import00_onerror, this);	
        	}
        	this.importObj.set_importurl(this.url);

        	this.importObj.importData("","Head=Sheet1!A2:F2;body=Sheet1!A3:F22","ds_excel");
        }

        //onsuccess Event
        this.Import00_onsuccess = function(obj,e)
        {
        	this.gd_excel.createFormat();
        	this.importObj = null;

        	trace("=========== onsuccess event start=============");
        	trace("e.eventid: "           + e.eventid);
        	trace("e.fromobject: "        + e.fromobject);
        	trace("e.fromreferenceobject: " + e.fromreferenceobject);
        	trace("e.url: "               + e.url);
        } 
             
        //onerror Event
        this.Import00_onerror = function(obj,e)
        {   
        	trace("=========== onerror event start===============");
        	trace("e.eventid: "             + e.eventid);
        	trace("e.fromobject: "          + e.fromobject);
        	trace("e.fromreferenceobject: " + e.fromreferenceobject);
        	trace("e.errorcode: "           + e.errorcode);
        	trace("e.errormsg: "            + e.errormsg);
        }                              

        
        });


        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button02.addEventHandler("onclick", this.Button02_onclick, this);

        };

        this.loadIncludeScript("ExcelImport.xfdl", true);

       
    };
}
)();
