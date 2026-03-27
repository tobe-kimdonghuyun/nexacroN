(function()
{
    return function(nexacro, system, trace)
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("Form_Work");
            this.set_titletext("Form_Work");
            if (nexacro.Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize
            obj = new nexacro.VirtualFile("vtf00", this);
            this.addChild(obj.name, obj);
            
            // UI Components Initialize
            obj = new nexacro.Button("Button00","280","20","134","45",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_text("Button00");
            this.addChild(obj.name, obj);

            obj = new nexacro.TextArea("txt00","16","84","393","331",null,null,null,null,null,null,this);
            obj.set_taborder("1");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new nexacro.Layout("default","Desktop_screen",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("Form_Work.xfdl", function(nexacro, system, trace) {

        this.Button00_onclick = function(obj,e)
        {
        	this.txt00.insertText(this.vtf00.createDirectory("c:\\TestFolder06", true))
        	this.txt00.insertText("\n")
        	this.txt00.insertText(this.vtf00.createDirectory("%USERAPP%\\TestFolder05"))
        	this.txt00.insertText("\n")
        	this.txt00.insertText(this.vtf00.createDirectory("Create_Test\\TestFolder01"))
        	this.txt00.insertText("\n")
        	this.txt00.insertText(this.vtf00.createDirectory("Create_Test"))
        	this.txt00.insertText("\n")

        	this.txt00.insertText("DeleteDirectory")
        	this.txt00.insertText("\n")

        	this.txt00.insertText(this.vtf00.deleteDirectory("c:\\TestFolder06"))
        	this.txt00.insertText("\n")
        	this.txt00.insertText(this.vtf00.deleteDirectory("%USERAPP%\\TestFolder05"))
        	this.txt00.insertText("\n")
        	this.txt00.insertText(this.vtf00.deleteDirectory("Create_Test\\TestFolder01"))
        	this.txt00.insertText("\n")
        	this.txt00.insertText(this.vtf00.deleteDirectory("Create_Test"))
        	this.txt00.insertText("\n")

        	this.txt00.insertText(this.vtf00.createDirectory("%USERAPP%VirtualFileFolder"))
        	this.txt00.insertText("\n")
        	this.txt00.insertText(this.vtf00.open("%USERAPP%VirtualFileFolder\\writeTest.txt", VirtualFile.openWrite))
        	this.txt00.insertText("\n")
        	this.txt00.insertText("getFileSize\n")
        	this.txt00.insertText("\n")
        	this.txt00.insertText(this.vtf00.getFileSize())
        	this.txt00.insertText("\n")
        	this.txt00.insertText("write data\n")
        	this.txt00.insertText(this.vtf00.write("test-write"))
        	this.txt00.insertText("\n")
        	this.vtf00.close();
        	this.txt00.insertText("isExist\n")
        	this.txt00.insertText(this.vtf00.isExist("%USERAPP%VirtualFileFolder\\writeTest.txt"))
        	this.txt00.insertText("\n")
        	this.txt00.insertText("copy\n")
        	this.txt00.insertText(this.vtf00.copy("%USERAPP%VirtualFileFolder\\writeTest.txt", "%USERAPP%VirtualFileFolder\\writeTest-copy.txt"))
        	this.txt00.insertText("\n")
        	this.txt00.insertText("rename\n")
        	this.txt00.insertText(this.vtf00.rename("%USERAPP%VirtualFileFolder\\writeTest.txt", "%USERAPP%VirtualFileFolder\\writeTest11.txt"))
        	this.txt00.insertText("\n")

        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.Button00.addEventHandler("onclick",this.Button00_onclick,this);
        };

        this.loadIncludeScript("Form_Work.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
