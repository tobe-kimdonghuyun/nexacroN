//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacro17-public-license-readme-1.1.html	
//
//==============================================================================

if (!nexacro.Switch)
{
    //==============================================================================
    // nexacro.SwitchChangedEventInfo
    //==============================================================================
    nexacro.SwitchChangedEventInfo = function (obj, id, prevalue, postvalue)
    {
        this.id = this.eventid = id || "onchanged";
        this.prevalue = prevalue;
        this.postvalue = postvalue;
        this.fromobject = this.fromreferenceobject = obj;
    };

    var _pSwitchChangedEventInfo = nexacro._createPrototype(nexacro.ChangedEventInfo, nexacro.SwitchChangedEventInfo);
    nexacro.SwitchChangedEventInfo.prototype = _pSwitchChangedEventInfo;
    _pSwitchChangedEventInfo._type_name = "SwitchChangedEventInfo";

    _pSwitchChangedEventInfo = null;

    //==============================================================================
    // nexacro.SwitchClickEventInfo
    //==============================================================================
    nexacro.SwitchClickEventInfo = function (obj, id, prevalue, postvalue)
    {
        this.id = this.eventid = id || "onclick";
        this.prevalue = prevalue;
        this.postvalue = postvalue;
        this.fromobject = this.fromreferenceobject = obj;
    }
    var _pSwitchClickEventInfo = nexacro._createPrototype(nexacro.ClickEventInfo, nexacro.SwitchClickEventInfo);
    nexacro.SwitchClickEventInfo.prototype = _pSwitchClickEventInfo;
    _pSwitchClickEventInfo._type_name = "SwitchClickEventInfo";

    _pSwitchClickEventInfo = null;

    //==============================================================================
    // nexacro.Switch
    //==============================================================================
    nexacro.Switch = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    };

    var _pSwitch = nexacro._createPrototype(nexacro.Component, nexacro.Switch);
    nexacro.Switch.prototype = _pSwitch;
    _pSwitch._type_name = "Switch";

    /*  control  */
    _pSwitch.switchbutton = null;
    _pSwitch._switchtext = null;

    /* default properties */
    _pSwitch._p_text = "";
    _pSwitch._p_value = false;
    _pSwitch._p_readonly = false;
    _pSwitch._p_falsevalue = null;
    _pSwitch._p_truevalue = null;
    _pSwitch._p_textposition = "right";
    _pSwitch._p_bartype = "fit";
    _pSwitch._p_switchbuttonwidth = undefined;

    /*status*/
    _pSwitch._is_focus_acceptable = true;
    _pSwitch._use_pushed_status = false;
    _pSwitch._use_selected_status = true;
    _pSwitch._use_readonly_status = true;

    /*accessibility role*/
    _pSwitch._p_accessibilityrole = "checkbox";
    _pSwitch._p_accessibilityenable = true;

    /* internal variable */
    _pSwitch._default_value = false;
    _pSwitch._selectstatus = false;

    /* event list */
    _pSwitch._event_list = {
        "onclick": 1, "ondblclick": 1, "onkillfocus": 1, "onsetfocus": 1,
        "oninput": 1, "onkeydown": 1, "onkeyup": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1,
        "onmousedown": 1, "onmouseup": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmousewheel": 1,
        "ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
        "onmove": 1, "onsize": 1, "oncontextmenu": 1, "onchanged": 1, "canchange": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1, "ondevicebuttonup": 1
    };

    //===============================================================
    // nexacro.Switch : Create & Destroy & Update 
    //===============================================================
    _pSwitch.on_create_contents = function ()
    {
        var control = this.getElement();
        if (control)
        {
            this._switchtext = new nexacro._IconText("switchtext", 0, 0, 0, 0, null, null, null, null, null, null, this);
            this.switchbutton = new nexacro.SwitchButtonControl("switchbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);

            this.on_apply_text(this._p_text);
            this.on_apply_textposition();
            this.on_apply_bartype();
            this.on_apply_switchbuttonwidth();            

            this._switchtext._setControl();
            this._switchtext.createComponent();
            this.switchbutton.createComponent();
        }
    };

    _pSwitch.on_created_contents = function (win) 
    {
        this.on_apply_value();

        if (this.fittocontents != "none")
        {
            this._update_position();
        }

        this.switchbutton.on_created(win);
        this._switchtext.on_created(win);

        if (nexacro._enableaccessibility)
        {
            this._on_created_accessibility_contents(win);
            this.switchbutton._setAccessibilityStatHidden(true);
        }
    };

    _pSwitch.on_after_created = function ()
    {        
        this.on_apply_textAlign(this._p_textAlign);
        this.on_apply_verticalAlign(this._p_verticalAlign);
        this.on_apply_textDecoration(this._p_textDecoration);
        this.on_apply_wordWrap(this._p_wordWrap);

        this._recalcLayout();
    };

    _pSwitch.on_destroy_contents = function ()
    {
        if (this.switchbutton)
        {
            this.switchbutton.destroy();
            this.switchbutton = null;
        }
        if (this._switchtext)
        {
            this._switchtext.destroy();
            this._switchtext = null;
        }
    };

    _pSwitch.on_create_contents_command = function ()
    {
		this.on_apply_text(this._p_text);
		this.on_apply_textposition();
		this.on_apply_bartype();
		this.on_apply_switchbuttonwidth();

        var str = "";

        if (this.switchbutton)
        {
            str += this.switchbutton.createCommand();
        }
        if (this._switchtext)
        {
            str += this._switchtext.createCommand();
        }

        return str;
    };

    _pSwitch.on_attach_contents_handle = function (win)
    {
        this.on_apply_value();

        if (this._p_fittocontents != "none")
        {
            this._update_position();
        }

        if (this.switchbutton)
        {
            this.switchbutton.attachHandle(win);
        }
        if (this._switchtext)
        {
            this._switchtext.attachHandle(win);
        }
        if (nexacro._enableaccessibility)
        {            
            this._on_attach_accessibility_contents_handle(win);            
        }
    };

    _pSwitch.on_change_containerRect = function (width, height)
    {
        this._recalcLayout();
    };

    //===============================================================
    // nexacro.Switch : Override
    //===============================================================
    _pSwitch.on_init_bindSource = function (columnid, propid, ds)
    {
        if (propid == "value")
        {
            this._setValue(this._default_value);
            this.on_apply_value();
        }
    };

    _pSwitch.on_change_bindSource = function (propid, ds, row, col)
    {
        if (propid == "value")
        {
            this._setValue(this._changeValue(ds.getColumn(row, col)));
            this.on_apply_value();
        }
    };

    _pSwitch.on_getBindableProperties = function ()
    {
        return "value";
    };

    _pSwitch._on_hotkey = function (key_code, alt_key, ctrl_key, shift_key)
    {
        this.on_fire_onclick("", alt_key, ctrl_key, shift_key, -1, -1, -1, -1, -1, -1, this, this, false);
    };

    _pSwitch._isFocusAcceptable = function ()
    {
        return this._is_focus_acceptable;
    };

    //===============================================================
    // nexacro.Switch : Properties
    //===============================================================
    _pSwitch.on_apply_text = function (text)
    {
        if (this._switchtext)
        {
            // _on_apply_text 함수 수정하고 변경
            this._switchtext.set_text(text);
            this._recalcLayout();
        }
    };

    _pSwitch.on_apply_textAlign = function (halign)
    {
        if (this._switchtext)
        {
            this._switchtext.on_apply_textAlign(halign);
        }
    };

    _pSwitch.on_apply_verticalAlign = function (valign)
    {
        if (this._switchtext)
        {
            this._switchtext.on_apply_verticalAlign(valign);
        }
    };

    _pSwitch.on_apply_textDecoration = function (textDecoration)
    {
        if (this._switchtext)
        {
            this._switchtext.on_apply_textDecoration(textDecoration);
        }
    };

    _pSwitch.on_apply_wordWrap = function (wordWrap)
    {
        if (this._switchtext)
        {
            this._switchtext.on_apply_wordWrap(wordWrap);
        }
    };

    _pSwitch.on_apply_edge = function ()
    {
        if (this._is_created)
        {
            var control_elem = this._control_element;
            if (control_elem)
                control_elem.setElementEdge(this._edge);
        }
    };

    _pSwitch.set_switchbuttonwidth = function (v)
    {
        //v = nexacro._isNull(v) ? 0 : +v;

        if (this._p_switchbuttonwidth != v)
        {
            this._p_switchbuttonwidth = v;
            this.on_apply_switchbuttonwidth();
        }
    }

    _pSwitch.on_apply_switchbuttonwidth = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            this._recalcLayout();
        }
    }

    _pSwitch.set_textposition = function (v)
    {
        if (this._p_textposition != v)
        {
            this._p_textposition = v;
            this.on_apply_textposition();
        }
    }

    _pSwitch.on_apply_textposition = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            this._recalcLayout();
        }
    }

    _pSwitch.set_bartype = function (v)
    {
        if (this._p_bartype != v)
        {
            this._p_bartype = v;
            this.on_apply_bartype();
        }
    }

    _pSwitch.on_apply_bartype = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            if (this.switchbutton)
            {
                this.switchbutton._recalcLayout();
            }
        }
    };

    _pSwitch.set_value = function (v)
    {
        v = this._changeValue(v);
        if (this._p_value != v)
        {
            if (this.applyto_bindSource("value", v))
            {
                this._setValue(v);
                this.on_apply_value();
            }
        }
    }

    _pSwitch.on_apply_value = function () 
    {
        var control_elem = this.getElement();
        if (control_elem)
        {            
            let checked = this._isChecked(this._p_value);
            this._changeUserStatus("selected", checked);
            if (this.switchbutton)
            {
                this.switchbutton._updateControlStatus("selected", checked);
            }

            this._setAccessibilityStatChecked(checked);
        }
    };

    _pSwitch.set_truevalue = function (v)
    {
        if (v != undefined)
            v = v.toString();

        if (this._p_truevalue !== v)
        {
            if (this._isChecked(this._p_value))
            {
                if (this.applyto_bindSource("value", v))
                {
                    this._setValue(v);
                }
            }
            this._p_truevalue = v;
        }
    };


    _pSwitch.set_falsevalue = function (v)
    {
        if (v != undefined)
            v = v.toString();

        if (this._p_falsevalue !== v)
        {
            if (!this._isChecked(this._p_value))
            {
                if (this.applyto_bindSource("value", v))
                {
                    this._setValue(v);
                }
            }
            this._p_falsevalue = v;
        }
    };

    _pSwitch.set_readonly = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_readonly != v)
        {
            this._p_readonly = v;
            this.on_apply_readonly(v);
        }
    };

	_pSwitch.on_apply_readonly = function (readonly)
    {
        if (this.switchbutton)
        {
            this.switchbutton.on_apply_readonly(readonly);
        }
		this._changeStatus("readonly", readonly);
	};

    _pSwitch.on_apply_prop_enable = function (v)
    {
        if (this.switchbutton)
        {
            this.switchbutton._setEnable(v);
        }
        nexacro.Component.prototype.on_apply_prop_enable.call(this, v);
    };

    _pSwitch._properties = [{ name: "value" }, { name: "truevalue" }, { name: "falsevalue" }, { name: "readonly" }, { name: "switchbuttonwidth" }, { name: "textposition" }, { name: "bartype" }];
    nexacro._defineProperties(_pSwitch, _pSwitch._properties);

    //===============================================================
    // nexacro.Switch : Methods
    //===============================================================
    _pSwitch.getSelectStatus = function ()
    {
        return this._isChecked(this._p_value);
    };

	_pSwitch.setSelectStatus = function (v)
    {
        this.set_value(v);
    };

    _pSwitch.toggleSelectStatus = function ()
    {
        var selected = this.getSelectStatus();
        this.setSelectStatus(!selected);
        return selected;
    };

    //===============================================================
    // nexacro.Switch : Event Handler
    //===============================================================
    _pSwitch.on_keyup_basic_action = function (key_code, alt_key, ctrl_key, shift_key, fire_comp, refer_comp)
    {
        if (key_code == nexacro.Event.KEY_SPACE)
        {
            this.on_fire_onclick("", alt_key, ctrl_key, shift_key, -1, -1, -1, -1, -1, -1, fire_comp, refer_comp, false);
        }
    };

    _pSwitch.on_rbuttonup_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, fire_comp, refer_comp)
    {
        this.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, -1, -1, fire_comp, refer_comp, false);
    }

    _pSwitch.on_lbuttonup_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, fire_comp, refer_comp)
    {
        this.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, -1, -1, fire_comp, refer_comp, false);
    }
    //===============================================================
    // nexacro.Switch : Event
    //===============================================================

    _pSwitch.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._isEnable() && !this._p_readonly)
        {
            var pre_val = this._p_value;
            var post_val = this._isChecked(pre_val) ? ((nexacro._isNull(this._p_falsevalue)) ? false : this._p_falsevalue) : ((nexacro._isNull(this._p_truevalue)) ? true : this._p_truevalue);

            var ret = this.on_fire_canchange(this, pre_val, post_val);
            if (ret)
            {
                if (pre_val !== post_val)
                {
                    this.set_value(post_val);
                    this.on_fire_onchanged(this, pre_val, post_val);
                }
            }

            if (this._is_alive)
            {
                return nexacro.Component.prototype.on_fire_onclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
            }
        }
        return false;
    };

    _pSwitch.on_fire_canchange = function (obj, prevalue, postvalue)
    {
        if (this.canchange && this.canchange._has_handlers)
        {
            var evt = new nexacro.SwitchChangedEventInfo(this, "canchange", prevalue, postvalue);
            return this.canchange._fireCheckEvent(this, evt);
        }
        return true;
    };

    _pSwitch.on_fire_onchanged = function (obj, prevalue, postvalue)
    {
        if (this.onchanged && this.onchanged._has_handlers)
        {
            var evt = new nexacro.SwitchChangedEventInfo(this, "onchanged", prevalue, postvalue);
            return this.onchanged._fireEvent(this, evt);
        }
    };
    _pSwitch._on_click = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key)
    {
        if (this._is_alive)
        {
            if (this._p_visible && this._isEnable())
            {
                var clientXY = this._getClientXY(canvasX, canvasY);
                this.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientXY[0], clientXY[1], this, this, meta_key);
                this.on_click_basic_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key);
            }
        }
    };
    //===============================================================
    // nexacro.Switch : Logical Part
    //===============================================================

    _pSwitch._recalcLayout = function ()
    {
        if (this._is_created_contents) 
        {
            var client_width = this._getClientWidth();
            var client_height = this._getClientHeight();

            var switchtext = this._switchtext;
                        
            var txtwidth = (this._p_text && switchtext) ? switchtext._on_getFitSize()[0] : 0;
            var btnwidth = client_width - txtwidth;

            var txtleft = 0, txttop = 0, txtheight = 0, btnleft = 0, btntop = 0, btnheight = 0;

            var switchbutton = this.switchbutton;
            var switchbuttonwidth = this._p_switchbuttonwidth;

            if (btnwidth + txtwidth > client_width)
            {
                txtheight = btnheight = (btnwidth / 2);
            }
            else
            {
                txtheight = btnheight = client_height;
            }

            if (switchtext && switchbutton) 
            {
                txtleft = (this._p_textposition == "right") ? btnwidth : 0;
                btnleft = (this._p_textposition == "right") ? 0 : txtwidth;

                if (switchbuttonwidth)
                {
                    btnwidth = txtleft = switchbuttonwidth;

                    if (switchbuttonwidth > client_width)
                    {
                        switchbuttonwidth = txtleft = client_width;
                    }
                }
                else
                {
                    if (switchbuttonwidth == 0)
                    {
                        btnwidth = 0;
                    }
                    else
                    {
                        switchbuttonwidth = client_width - txtwidth;
                    }
                }

                switchtext.move(txtleft, txttop, txtwidth, txtheight);
                switchbutton.move(btnleft, btntop, btnwidth, btnheight);
            }
        }
    };
    //===============================================================
    // nexacro.Switch : Util Function
    //===============================================================
    _pSwitch._setValue = function (v)
    {
        this._p_value = v;
    };

    _pSwitch._changeValue = function (v)
    {
        var use_truevalue = !nexacro._isNull(this._p_truevalue);
        var use_falsevalue = !nexacro._isNull(this._p_falsevalue);

        if (nexacro._isNull(v))
        {
            if (use_falsevalue)
                return this._p_falsevalue
            return false;
        }

        v = v.toString();
        if (use_truevalue)
        {
            if (v === this._p_truevalue)
            {
                // priority one
                return v;
            }

            if (use_falsevalue)
            {
                // truevalue, falsevalue both
                if (v === this._p_falsevalue)
                    return v;
                return this._p_value;
            }
            else
            {
                if (parseInt(v) === 0)
                {
                    return 0;
                }
                else if (parseInt(v) === 1)
                {
                    return 1;
                }
            }
        }
        return nexacro._toBoolean(v);
    };

    _pSwitch._isChecked = function (value)
    {
        if (this._p_truevalue != null)
        {
            if (this._p_falsevalue != null) // both
            {
                if (value === this._p_falsevalue || value === undefined)
                {
                    return false;
                }

                if (value === this._p_truevalue || nexacro._toBoolean(value) || this._p_value === this._p_truevalue)
                {
					return true;
				}
				return false;
			}
			return (value === this._p_truevalue || nexacro._toBoolean(value)) ? true : false;
		}
		else // not use truevalue
		{
			if (this._p_falsevalue != null) // falsevalue only
            {
                return (value === this._p_falsevalue) ? false : true;
			}
			return nexacro._toBoolean(value);
		}
	};

    _pSwitch._applyStatus = function ()
    {
        var pre_val = this._p_value;
        var post_val = (this._isChecked(pre_val)) ? ((nexacro._isNull(this._p_falsevalue)) ? false : this._p_falsevalue) : ((nexacro._isNull(this._p_truevalue)) ? true : this._p_truevalue);

        var ret = this.on_fire_canchange(this, pre_val, post_val);
        if (ret)
        {
            if (this.applyto_bindSource("value", post_val))
            {
                this._setValue(post_val);
            }

            if (pre_val !== post_val)
            {
                this.on_fire_onchanged(this, pre_val, post_val);
            }
            if (this._is_alive)
                this.on_apply_value();
        }
    };

    _pSwitch = null;
    //==============================================================================
    // nexacro.SwitchButtonControl
    //==============================================================================
    nexacro.SwitchButtonControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro._IconText.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pSwitchButtonControl = nexacro._createPrototype(nexacro.Component, nexacro.SwitchButtonControl);
    nexacro.SwitchButtonControl.prototype = _pSwitchButtonControl;
    _pSwitchButtonControl._type_name = "SwitchButtonControl";

    _pSwitchButtonControl._is_subcontrol = true;

    _pSwitchButtonControl._switchbuttonitem = null;
    _pSwitchButtonControl._switchbuttontrack = null;

    /* Status */
    _pSwitchButtonControl._use_pushed_status = false;
    _pSwitchButtonControl._use_selected_status = true;

    _pSwitchButtonControl._bartype = undefined;

    //==============================================================================
    // nexacro.SwitchButtonControl : Create & Destroy & Update
    //==============================================================================
    _pSwitchButtonControl.on_create_contents = function ()
    {
        var control = this.getElement();
        if (control)
        {
            this._switchbuttonitem = new nexacro.SwitchButtonItemControl("switchbuttonitem", 0, 0, 0, 0, null, null, null, null, null, null, this);
            this._switchbuttontrack = new nexacro.SwitchTrackControl("switchbuttontrack", 0, 0, 0, 0, null, null, null, null, null, null, this);

            this._switchbuttonitem._setControl();
            this._switchbuttontrack._setControl();

            this._switchbuttontrack.createComponent(true);
            this._switchbuttonitem.createComponent(true);
        }
    };

    _pSwitchButtonControl.on_created_contents = function (win)
    {
        this._switchbuttontrack.on_created(win);
        this._switchbuttonitem.on_created(win);
    };

    _pSwitchButtonControl.on_destroy_contents = function ()
    {
        if (this._switchbuttonitem)
        {
            this._switchbuttonitem.destroy();
            this._switchbuttonitem = null;
        }
        if (this._switchbuttontrack)
        {
            this._switchbuttontrack.destroy();
            this._switchbuttontrack = null;
        }
    };

    _pSwitchButtonControl.on_create_contents_command = function ()
    {
        this.redraw();
        var str = "";
        if (this._switchbuttontrack)
        {
            str += this._switchbuttontrack.createCommand();
        }
        if (this._switchbuttonitem)
        {
            str += this._switchbuttonitem.createCommand();
        }
        return str;
    };

    _pSwitchButtonControl.on_attach_contents_handle = function (win)
    {
        if (this._switchbuttonitem)
        {
            this._switchbuttonitem.attachHandle(win);
        }
        if (this._switchbuttontrack)
        {
            this._switchbuttontrack.attachHandle(win);
        }
    };

    _pSwitchButtonControl.on_change_containerRect = function (width, height)
    {
        this._recalcLayout();
    };
    //==============================================================================
    // nexacro.SwitchButtonControl : Override
    //==============================================================================
    _pSwitchButtonControl.on_getIDCSSSelector = function ()
    {
        return "switchbutton";
    };
    //==============================================================================
    // nexacro.SwitchButtonControl : Properties
    //==============================================================================
    _pSwitchButtonControl.on_apply_readonly = function (readonly)
    {
        if (this._switchbuttonitem)
        {
            this._switchbuttonitem.on_apply_readonly(readonly);
        }
    };

    _pSwitchButtonControl.on_apply_prop_enable = function (v)
    {
        if (this._switchbuttonitem)
        {
            this._switchbuttonitem._setEnable(v);
        }
        if (this._switchbuttontrack)
        {
            this._switchbuttontrack._setEnable(v);
        }
    };

    //==============================================================================
    // nexacro.SwitchButtonControl : Methods
    //==============================================================================

    //==============================================================================
    // nexacro.SwitchButtonControl : Event Handler
    //==============================================================================
    _pSwitchButtonControl._setEventHandler = function ()
    {
        var switchbuttontrack = this._switchbuttontrack;
        if (switchbuttontrack)
        {
            switchbuttontrack._setEventHandler("onclick", this.on_notify_switchbuttontrack_onclick, this);
        }
    };
    //==============================================================================
    // nexacro.SwitchButtonControl : Loical Part
    //==============================================================================

    _pSwitchButtonControl._recalcLayout = function ()
    {
        var control_elem = this.getElement();

        if (control_elem) 
        {
            var togglebutton = this._switchbuttonitem;
            var switchbuttontrack = this._switchbuttontrack;

            if (togglebutton && switchbuttontrack)
            {
                var bartype = this.parent._p_bartype;
                var client_width = this._getClientWidth();
                var client_height = this._getClientHeight();
                var togglebutton_height, togglebutton_width;
                togglebutton_width = togglebutton_height = client_height

                var switchbuttontrack_width = client_width;
                var switchbuttontrack_height = client_height;
                var switchbuttontrack_left = 0;
                var switchbuttontrack_top = 0;

                if (bartype) 
                {
                    if (bartype == "line" || bartype == "inner")
                    {
                        var switchbuttontrack_size_factor = bartype == "line" ? 0.2 : 0.4;
                        switchbuttontrack_height = switchbuttontrack_height * switchbuttontrack_size_factor;
                        switchbuttontrack_width = switchbuttontrack_width * 0.8;
                        switchbuttontrack_top = (client_height - switchbuttontrack_height) * 0.5;
                    }
                }

                if (this.parent) //�����Ұ�
                {
                    if (this.parent._p_value == true)
                        togglebutton._setRight(0);
                    else
                        togglebutton._setLeft(0);
                }

                //togglebutton.set_top(0);

                togglebutton.resize(togglebutton_width, togglebutton_height);
                switchbuttontrack.move(switchbuttontrack_left, switchbuttontrack_top, switchbuttontrack_width, switchbuttontrack_height);
            }
        }
    };

    _pSwitchButtonControl._moveToggleButton = function (v) 
    {
        var control_elem = this.getElement();
        if (control_elem) 
        {
            var togglbutton = this._switchbuttonitem;
            if (togglbutton)
            {

                if (v)
                {
                    togglbutton._setLeft(null);
                    togglbutton._setRight(0);
                    togglbutton._update_position();
                }
                else
                {
                    togglbutton.set_left(0);
                    togglbutton.set_right(null);
                }
            }
        }
    };

    _pSwitchButtonControl._updateControlStatus = function (userstatus, value) 
    {
        this._changeUserStatus(userstatus, value);
        if (this._switchbuttontrack)
        {
            this._switchbuttontrack._changeUserStatus(userstatus, value);
        }
        if (this._switchbuttonitem)
        {
            this._switchbuttonitem._changeUserStatus(userstatus, value);
        }
        this._moveToggleButton(value);
    };

    //==============================================================================
    // nexacro.SwitchButtonControl : Util function
    //==============================================================================

    _pSwitchButtonControl = null;

    //==============================================================================
    // nexacro.SwitchButtonItem
    //==============================================================================
    nexacro.SwitchButtonItemControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    }
    var _pSwitchButtonItemControl = nexacro._createPrototype(nexacro.Component, nexacro.SwitchButtonItemControl);
    nexacro.SwitchButtonItemControl.prototype = _pSwitchButtonItemControl;
    _pSwitchButtonItemControl._type_name = "SwitchButtonItem";

    _pSwitchButtonItemControl._is_subcontrol = true;
    _pSwitchButtonItemControl._thumbbutton = null;

    _pSwitchButtonItemControl.on_getIDCSSSelector = function ()
    {
        return "switchbuttonitem";
    };

    //==============================================================================
    // nexacro.SwitchButtonItem : Create & Destroy & Update
    //==============================================================================
    _pSwitchButtonItemControl.on_create_contents = function ()
    {
        var control = this.getElement();
        if (control)
        {
            this._thumbbutton = new nexacro.SwitchThumbButtonControl("switchthumbbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
            this._thumbbutton._setControl();
            this._thumbbutton.createComponent(true);
        }
    };

    _pSwitchButtonItemControl.on_created_contents = function (win)
    {
        this._thumbbutton.on_created(win);
    };

    _pSwitchButtonItemControl.on_destroy_contents = function ()
    {
        if (this._thumbbutton)
        {
            this._thumbbutton.destroy();
            this._thumbbutton = null;
        }
    };

    _pSwitchButtonItemControl.on_create_contents_command = function ()
    {
        this.redraw();
        var str = "";
        if (this._thumbbutton)
        {
            str += this._thumbbutton.createCommand();
        }
        return str;
    };

    _pSwitchButtonItemControl.on_change_containerRect = function (width, height)
    {
        this._recalcLayout();
    };

    _pSwitchButtonItemControl._recalcLayout = function ()
    {
        var control_elem = this.getElement();
        if (control_elem) 
        {
            var button = this._thumbbutton;
            if (button)
            {
                var client_height = this._getClientHeight();
                button.resize(client_height, client_height);
            }
        }
    };

    _pSwitchButtonItemControl.on_attach_contents_handle = function (win)
    {
        if (this._thumbbutton)
        {
            this._thumbbutton.attachHandle(win);
        }
    };

    //==============================================================================
    // nexacro.SwitchButtonItem : Properties
    //==============================================================================
    _pSwitchButtonItemControl.on_apply_readonly = function (readonly)
    {
        this._changeStatus("readonly", readonly);
    };

    _pSwitchButtonItemControl.on_apply_prop_enable = function (v)
    {
        if (this._thumbbutton)
        {
            this._thumbbutton._setEnable(v);        
        }
    };

    _pSwitchButtonItemControl = null;

    //==============================================================================
    // nexacro.ThumbButtonControl
    //==============================================================================
    nexacro.SwitchThumbButtonControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    }
    var _pSwitchThumbButtonControl = nexacro._createPrototype(nexacro.Button, nexacro.SwitchThumbButtonControl);
    nexacro.SwitchThumbButtonControl.prototype = _pSwitchThumbButtonControl;
    _pSwitchThumbButtonControl._type_name = "SwitchThumbButtonControl";

    _pSwitchThumbButtonControl._is_subcontrol = true;
    _pSwitchThumbButtonControl._use_pushed_status = false;
    _pSwitchThumbButtonControl._use_selected_status = true;

    _pSwitchThumbButtonControl.on_getIDCSSSelector = function ()
    {
        return "switchthumbbutton";
    };

    //==============================================================================
    // nexacro.ThumbButtonControl : Properties
    //==============================================================================
    _pSwitchThumbButtonControl.on_apply_readonly = function (readonly)
    {
        this._changeStatus("readonly", readonly);
    };

    _pSwitchThumbButtonControl = null;

    //==============================================================================
    // nexacro.SwitchTrackControl
    //==============================================================================
    nexacro.SwitchTrackControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    }
    var _pSwitchTrackControl = nexacro._createPrototype(nexacro.Button, nexacro.SwitchTrackControl);
    nexacro.SwitchTrackControl.prototype = _pSwitchTrackControl;
    _pSwitchTrackControl._type_name = "SwitchTrackControl";

    _pSwitchTrackControl._is_subcontrol = true;

    _pSwitchTrackControl._use_pushed_status = false;
    _pSwitchTrackControl._use_selected_status = true;

    _pSwitchTrackControl.on_getIDCSSSelector = function ()
    {
        return "switchbuttontrack";
    }

    _pSwitchTrackControl = null;


}