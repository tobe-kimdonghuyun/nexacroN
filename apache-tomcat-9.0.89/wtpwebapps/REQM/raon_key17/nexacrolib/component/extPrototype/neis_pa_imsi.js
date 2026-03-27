/**
*  나이스 대국민 공통
*  @FileName 	neis_pa_imsi.js 
*  @Creator 	consulting
*  @CreateDate 	2022.05.18
*  @Desction   	대국민 공통
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
*  2022.05.18     	consulting 	                최초 생성 
*******************************************************************************
*/
// (2023.02.22)  다이얼로그가 닫힐때, 크롬에서 검은색배경이 없어지지 않는 문제 해결
nexacro._GridCellControl.prototype._on_focus = function(_a, _b, _c, _d, _e, _f) {
	if(this._grid)
	{
		this._grid._focused_row = this._getDataRow();
		this._grid._focused_cell = this._cellidx;
		nexacro.Component.prototype._on_focus.call(this, _a, _b, _c, _d, _e, _f);
	}
}

//**********************************************************************************************
//  2023.03.02 - 파일업로드 다운로드 샘플에서 Onload시 에러나는 경우 대응 - START
//               (Runtime에서만 발생 - ComComp.js)  ===>  해결 - 1340 버전
//**********************************************************************************************
/*
nexacro.WebBrowser.prototype.on_killfocus_basic_action11=function(_a,_b){
	var _c=this._ifrm_elem;
	if(_c&&this._old_evt_name=="downkey"){
		if(_c._setElementBackwardFocus)
		{
			_c._setElementBackwardFocus(this._getAccessibilityReadLabel(),this.accessibilityleavemessage);
		}
		this._old_evt_name="";
	}
	nexacro.Component.prototype.on_killfocus_basic_action.call(this);
};


nexacro.WebBrowser.prototype._apply_setfocus11=function(_a,_b,_c,_d)
{
	var _e=this._ifrm_elem;
	if(_e){
		if(nexacro._enableaccessibility&&nexacro._accessibilitytype==2)
		{
			if(!_a)
			{
				if(_c==this._refform._getPrevComponent(this,true))
				{
					_a="downkey";
				}else
				{
					_a="upkey";
				}
				this._old_evt_name=_a;
			}
			
			if(_a=="downkey"||_a=="tabkey")
			{
				if(_e._setElementForwardFocus)
				{
					_e._setElementForwardFocus(this._getAccessibilityReadLabel(),this.accessibilityleavemessage);
				}
			}
			else if(_a=="upkey"||_a=="shifttabkey")
			{
				if(_e._setElementBackwardFocus)
				{
					_e._setElementBackwardFocus(this._getAccessibilityReadLabel(),this.accessibilityleavemessage);
				}
			}
		}
		else
		{
			_e._setElementFocus();
		}
	}
};
*/
//**********************************************************************************************
//  2023.03.02 - 파일업로드 다운로드 샘플에서 Onload시 에러나는 경우 대응 - END
//               (Runtime에서만 발생 - ComComp.js)
//**********************************************************************************************

//**********************************************************************************************
//  2023.04.10 - 로그아웃연장팝업 뜰 경우, 대입전형에서 에러나는 경우 대응 - Start
//               (Runtime에서만 발생 - ComBase.js)
//**********************************************************************************************
nexacro.MainFrame.prototype._getTitleText = function(_a) {
	var _b;
	_b = this.titletext||"";
	if (_a) {
		var _c = this.frame;
		if (_c) {
			var _d = _c._getTitleText(true);
			// (수정)
			//if (_d.length > 0) {
			if (_d.length > 0) {
				// (수정)
				//if (_b.length > 0) {
				if (_b&&_b.length > 0) {
					_b += " - ";
				}
				_b += _d;
			}
		}
	}
	return _b;
}
;	
//**********************************************************************************************
//  2023.04.10 - 로그아웃연장팝업 뜰 경우, 대입전형에서 에러나는 경우 대응 - End
//               (Runtime에서만 발생 - ComBase.js)
//**********************************************************************************************
