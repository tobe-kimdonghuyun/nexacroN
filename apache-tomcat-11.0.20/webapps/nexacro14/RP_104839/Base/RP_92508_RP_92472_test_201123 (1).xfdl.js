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
                this.set_name("test_201123");
                this.set_titletext("New Form");
                this._setFormPosition(0,0,1018,558);
            }

            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new Dataset("Dataset00", this);
            obj._setContents("<ColumnInfo><Column id=\"Column0\" type=\"STRING\" size=\"256\"/><Column id=\"Column1\" type=\"STRING\" size=\"256\"/><Column id=\"Column2\" type=\"STRING\" size=\"256\"/><Column id=\"Column3\" type=\"STRING\" size=\"256\"/><Column id=\"Column4\" type=\"STRING\" size=\"256\"/><Column id=\"Column5\" type=\"STRING\" size=\"256\"/><Column id=\"Column6\" type=\"STRING\" size=\"256\"/><Column id=\"Column7\" type=\"STRING\" size=\"256\"/></ColumnInfo>");
            this.addChild(obj.name, obj);

            obj = new Dataset("Dataset01", this);
            obj._setContents("<ColumnInfo><Column id=\"Column0\" type=\"STRING\" size=\"256\"/><Column id=\"Column1\" type=\"STRING\" size=\"256\"/><Column id=\"Column2\" type=\"STRING\" size=\"256\"/><Column id=\"Column3\" type=\"STRING\" size=\"256\"/><Column id=\"Column4\" type=\"STRING\" size=\"256\"/><Column id=\"Column5\" type=\"STRING\" size=\"256\"/><Column id=\"Column6\" type=\"STRING\" size=\"256\"/><Column id=\"Column7\" type=\"STRING\" size=\"256\"/></ColumnInfo><Rows><Row><Col id=\"Column2\">COL1</Col><Col id=\"Column3\">COL2</Col><Col id=\"Column4\">COL3</Col><Col id=\"Column5\">COL4</Col><Col id=\"Column6\">COL5</Col><Col id=\"Column7\">COL6</Col></Row><Row><Col id=\"Column2\">Project Code</Col><Col id=\"Column3\">Ver</Col><Col id=\"Column4\">period</Col><Col id=\"Column5\">Type</Col><Col id=\"Column6\">N/A</Col><Col id=\"Column7\">테스트결과</Col></Row><Row><Col id=\"Column2\">1</Col><Col id=\"Column3\">2</Col><Col id=\"Column4\">3</Col><Col id=\"Column5\">4</Col><Col id=\"Column6\">5</Col><Col id=\"Column7\">6</Col></Row><Row><Col id=\"Column2\">1</Col><Col id=\"Column3\">2</Col><Col id=\"Column4\">3</Col><Col id=\"Column5\">4</Col><Col id=\"Column6\">5</Col><Col id=\"Column7\">6</Col></Row><Row><Col id=\"Column2\">1</Col><Col id=\"Column3\">2</Col><Col id=\"Column4\">3</Col><Col id=\"Column5\">4</Col><Col id=\"Column6\">5</Col><Col id=\"Column7\">6</Col></Row></Rows>");
            this.addChild(obj.name, obj);


            
            // UI Components Initialize
            obj = new Grid("Grid00", "absolute", "28", "28", "72.69%", "48.57%", null, null, this);
            obj.set_taborder("0");
            obj.set_binddataset("Dataset00");
            obj._setContents("<Formats><Format id=\"default\"><Columns><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/><Column size=\"80\"/></Columns><Rows><Row band=\"head\" size=\"24\"/><Row band=\"body\" size=\"24\"/></Rows><Band id=\"head\"><Cell col=\"0\" disptype=\"normal\" text=\"Column0\"/><Cell col=\"1\" disptype=\"normal\" text=\"Column1\"/><Cell col=\"2\" disptype=\"normal\" text=\"Column2\"/><Cell col=\"3\" disptype=\"normal\" text=\"Column3\"/><Cell col=\"4\" disptype=\"normal\" text=\"Column4\"/><Cell col=\"5\" disptype=\"normal\" text=\"Column5\"/><Cell col=\"6\" disptype=\"normal\" text=\"Column6\"/></Band><Band id=\"body\"><Cell col=\"0\" disptype=\"normal\" text=\"bind:Column0\"/><Cell col=\"1\" disptype=\"normal\" text=\"bind:Column1\"/><Cell col=\"2\" disptype=\"normal\" text=\"bind:Column2\"/><Cell col=\"3\" disptype=\"normal\" text=\"bind:Column3\"/><Cell col=\"4\" disptype=\"normal\" text=\"bind:Column4\"/><Cell col=\"5\" disptype=\"normal\" text=\"bind:Column5\"/><Cell col=\"6\" disptype=\"normal\" text=\"bind:Column6\"/></Band></Format></Formats>");
            this.addChild(obj.name, obj);

            obj = new Button("Button00", "absolute", "28", "320", "12.57%", "11.11%", null, null, this);
            obj.set_taborder("1");
            obj.set_text("createFormat");
            this.addChild(obj.name, obj);

            obj = new Button("Button01", "absolute", "181", "320", "10.12%", "7.89%", null, null, this);
            obj.set_taborder("2");
            obj.set_text("Import");
            this.addChild(obj.name, obj);

            obj = new Button("Button02", "absolute", "299", "320", "13.56%", "11.11%", null, null, this);
            obj.set_taborder("3");
            obj.set_text("delete");
            this.addChild(obj.name, obj);


            
            // Layout Functions
            //-- Default Layout
            obj = new Layout("default", "", 1018, 558, this,
            	//-- Layout function
            	function(p) {
            		p.set_titletext("New Form");

            	}
            );
            this.addLayout(obj.name, obj);


            
            // BindItem Information

            
            // Remove Reference
            obj = null;
        };
        

        
        // User Script
        this.registerScript("RP_92508_RP_92472_test_201123 (1).xfdl", function(exports) {

        this.Button00_onclick = function(obj,e)
        {
        	this.Grid00.createFormat();
        	return;
        	this.Dataset00.set_updatecontrol(false);
        	for(var i = this.Dataset00.getColCount()-1; i >=0 ; i--)
        	{
        		if(this.Dataset00.getColumn(0, i) == null)
        		{
        			this.Dataset00.deleteColumn(i);
        		}
        		else
        		{
        			alert("aaa");
        			this.Dataset00.updateColID(i, this.Dataset00.getColumn(0, i));
        			trace(this.Dataset00.saveXML());
        			
        		}
        	}	
        	
        	this.Dataset00.set_updatecontrol(true);	
        	
        	
        	this.Dataset00.addColumn("test", "string");	
        	
        	this.Dataset00.setColumn(0, "test", "테스트 입니다.");
        	this.Grid00.createFormat();
        }

        
        this.Button01_onclick = function(obj,e)
        {
        	var importObj1 = new nexacro.ExcelImportObject("Import00",this); 
                
            importObj1.set_importtype(nexacro.ImportTypes.EXCEL2007);    
            importObj1.addEventHandler("onsuccess" ,this.excelImport_onsuccess ,this);
            importObj1.addEventHandler("onerror"   ,this.excelImport_onerror   ,this);

            //var importurl = 'http://172.10.13.73:8080/XExportImport';
             this.importurl = "http://localhost:9090/nexacro14_xeni_20251223(2.0.5)_1/XExportImport";   
        	importObj1.set_importurl(this.importurl);		
        	//importObj1.set_importfilemode("server");		
        	
        	var sParam = "[command=getsheetdata;output=output1;body=sheet!A1;]";	
        	var sParam2 = "[Dataset00=output1]";	
        	importObj1.importData("", sParam, sParam2);
        	
        	this.Grid00.set_binddataset("Dataset00");
        	this.addChild("Import00", importObj1);
        	importObj1 = null; 
        }

        this.Button02_onclick = function(obj,e)
        {
        	this.Dataset00.set_updatecontrol(false);
        	this.Dataset00.deleteColumn(0);
        	this.Dataset00.set_updatecontrol(true);	
        	
        			
        }

        this.excelImport_onsuccess = function(obj,e)
        {
            alert("업로드 성공");      
        	this.Grid00.createFormat();
        	
        }

        this.excelImport_onerror = function(obj,e)
        {
            alert("업로드 실패");
        	
            trace("=========== onerror event start============");
            trace("e.eventid:    "          + e.eventid);
            trace("e.fromobject: "          + e.fromobject);
            trace("e.fromreferenceobject: " + e.fromreferenceobject);
            trace("e.errorcode: "           + e.errorcode);
            trace("e.errormsg: "            + e.errormsg);
        }
        
        });


        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button00.addEventHandler("onclick", this.Button00_onclick, this);
            this.Button01.addEventHandler("onclick", this.Button01_onclick, this);
            this.Button02.addEventHandler("onclick", this.Button02_onclick, this);

        };

        this.loadIncludeScript("RP_92508_RP_92472_test_201123 (1).xfdl", true);

       
    };
}
)();
