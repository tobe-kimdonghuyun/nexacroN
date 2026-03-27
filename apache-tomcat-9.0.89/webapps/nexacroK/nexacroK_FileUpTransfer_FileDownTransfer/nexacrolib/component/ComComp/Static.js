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

if (!nexacro._IconText && nexacro._use_legacy_icontext)
{
    //==============================================================================
    // nexacro._IconText
    //==============================================================================
    nexacro._IconText = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pIconText = nexacro._createPrototype(nexacro.Component, nexacro._IconText);
    nexacro._IconText.prototype = _pIconText;
    _pIconText._type_name = "IconText";

    /* element */
    _pIconText._cell_elem = null;

    /* default properties */
    _pIconText._p_text = "";
    _pIconText._p_icon = "";
    _pIconText._p_iconPosition = "";
    _pIconText._p_textPadding = "";
    _pIconText._p_textwidth = undefined;
    _pIconText._p_tabstop = false;

    /* internal variable */
    _pIconText._textpadding = null;

    /* status */
    _pIconText._is_focus_accept = false;
    _pIconText._is_simple_control = true;
    _pIconText._is_eventinfo_control = false;
    _pIconText._is_fiticonsize = false;
    _pIconText._icon_width = 0;
    _pIconText._icon_height = 0;
    _pIconText._usedecoratetext = false;

    /* accessibility */
    _pIconText._p_accessibilityrole = "none";

    //===============================================================
    // nexacro._IconText : Create & Destroy & Update 
    //===============================================================
    _pIconText.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var cellElem = this._cell_elem = new nexacro.IconTextElement(control_elem, "icontext", this._is_fiticonsize);

            //process padding to position
            cellElem.setElementPosition(this._getClientLeft(), this._getClientTop());
            cellElem.setElementSize(control_elem.client_width, control_elem.client_height);

            // apply non-inherited style-props
            // css Generation code & generate Icon._padding_info/Icon._align_info to css (.Icon .nexacontentsbox { text-align/vertical-align })

            if (this._p_textAlign)
                cellElem.setElementTextAlign(this._p_textAlign);
            if (this._p_verticalAlign)
                cellElem.setElementVerticalAlign(this._p_verticalAlign);

            var wordwrap_info = this._getCSSStyleValue("wordWrap");
            if (wordwrap_info)
                cellElem.setElementCSSMapInfo(wordwrap_info);

            if (this._p_wordWrap)
                cellElem.setElementWordWrap(this._p_wordWrap);

            var textPadding = this._textpadding || this._getCSSStyleValue("textPadding");
            if (textPadding)
                cellElem.setElementTextPadding(textPadding);

            if (this._p_textwidth != null)
                cellElem.setElementTextWidth(this._p_textwidth);

            if (this._textdecoration)
                cellElem.setElementTextDecoration(this._textdecoration);

            if (this._displaytext)
            {
                if (this._usedecoratetext)
                    cellElem.setElementDecorateText(this._displaytext);
                else
                    cellElem.setElementText(this._displaytext);
            }

            var icon = this._icon || this._getCSSStyleValue("icon");
            if (icon)
                cellElem.setElementIcon(icon);

            var icon_pos = this._p_iconPosition || this._getCSSStyleValue("iconPosition");
            cellElem.setElementIconPos(icon_pos);
            if (this._p_fittocontents != "none")
                this._on_apply_fittocontents();
        }
    };

    _pIconText.on_created_contents = function (win)
    {
        if (this._p_expr)
            this._on_apply_expr(this._p_expr);

        if (this._p_fittocontents != "none")
        {
            this._update_position();
            //this._on_apply_fittocontents();
        }

        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.create(win);

            // 오류 예방 
            if (this._env._p_enableaccessibility)
            {
                this._on_created_accessibility_contents(win);
            }
        }
    };

    _pIconText.on_destroy_contents = function ()
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.destroy();
            this._cell_elem = null;
        }

        if (this._textpadding)
            this._textpadding = null;

        if (this._icon)
            this._icon = null;
    };

    _pIconText.on_create_contents_command = function ()
    {
        if (this._p_expr)
            this._on_apply_expr(this._p_expr);

        var cellElem = this._cell_elem;
        if (cellElem)
        {
            return cellElem.createCommand();
        }

        return "";
    };

    _pIconText.on_attach_contents_handle = function (win)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.attachHandle(win);
        }

        if (this._p_fittocontents != "none")
        {
            this._update_position();
        }
    };

    _pIconText.on_change_containerRect = function (width, height)
    {
        if (this._is_created_contents)
        {
            var cellElem = this._cell_elem;
            cellElem.setElementSize(width, height);
        }
    };

    _pIconText.on_change_containerPos = function (left, top)
    {
        if (this._is_created_contents)
        {
            var cellElem = this._cell_elem;
            cellElem.setElementPosition(left, top);
        }
    };

    //===============================================================
    // nexacro._IconText : Override
    //===============================================================	
    _pIconText.on_apply_status = function (status, userstatus)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            if (!this._p_textPadding)
                cellElem.setElementTextPadding(this._getCSSStyleValue("textPadding", status, userstatus));
            if (!this._p_icon)
                cellElem.setElementIcon(this._getCSSStyleValue("icon", status, userstatus));
            if (!this._p_iconPosition)
                cellElem.setElementIconPos(this._getCSSStyleValue("iconPosition", status, userstatus));

            var wordwrap_info = this._getCSSStyleValue("wordWrap", status, userstatus);
            if (wordwrap_info)
                cellElem.setElementCSSMapInfo(wordwrap_info);
        }
    };

    _pIconText._on_getFitSize = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var total_w = 0;
            var total_h = 0;

            var border = this._getCurrentStyleBorder();
            if (border)
            {
                total_w += border._getBorderWidth();
                total_h += border._getBorderHeight();
            }

            var padding = this._getCurrentStylePadding();
            if (padding)
            {
                total_w += padding.left + padding.right;
                total_h += padding.top + padding.bottom;
            }

            var border_padding_w = total_w;
            var border_padding_h = total_h;

            var text;
            if (this._displaytext && this._displaytext !== "")
            {
                // apply_text로 처리된 대상 기준으로 fittocontects가 이루어져야 함
                text = this._displaytext;
            }
            else
                text = this._p_text;
            if (text)
            {
                var font = this._getCurrentStyleInheritValue("font");
                var refer_font = this._getReferenceAbsoluteFont(font); // use to em / rem
                var wordspace = this._getCurrentStyleInheritValue("wordSpacing");
                var letterspace = this._getCurrentStyleInheritValue("letterSpacing");
                var wordwrap = "none";
                var width;

                var multiline = false;
                if (text.search("\n") > -1)
                {
                    multiline = true;
                }

                if (this._p_fittocontents == "height")
                {
                    wordwrap = this._p_wordWrap || this._getCSSStyleValue("wordWrap");
                    if (wordwrap && wordwrap != "none")
                        multiline = true;

                    width = this._adjust_width - total_w;
                }

                var text_size = nexacro._getTextSize(text, font, multiline, width, wordwrap, wordspace, letterspace, this._usedecoratetext, undefined, undefined, refer_font);

                total_w += Math.ceil(this._p_textwidth != null ? this._p_textwidth : text_size[0]);
                total_h += Math.ceil(text_size[1]);
            }

            var icon = this._icon || this._getCSSStyleValue("icon");
            if (icon)
            {
                var textpadding = this._textpadding || this._getCSSStyleValue("textPadding");
                var icon_pos = this._p_iconPosition || this._getCSSStyleValue("iconPosition");

                var icon_size;
                if (this._icon_width != 0 && this._icon_height != 0)
                {
                    icon_size = { width: this._icon_width, height: this._icon_height };
                }
                else
                {
                    icon_size = nexacro._getImageSize(icon.url, this._on_icon_onload, this, undefined, this.image) || { width: this._icon_width, height: this._icon_height };
                }

                if (icon_pos == "top" || icon_pos == "bottom")
                {
                    total_h += icon_size.height;
                    total_w = Math.max(total_w, icon_size.width + border_padding_w);
                }
                else
                {
                    total_w += icon_size.width;
                    total_h = Math.max(total_h, icon_size.height + border_padding_h);
                }

                if (textpadding)
                {
                    total_w += textpadding.left + textpadding.right;
                    total_h += textpadding.top + textpadding.bottom;
                }
            }

            return [total_w, total_h];
        }

        return [this._adjust_width, this._adjust_height];
    };

    _pIconText._isFocusAcceptable = function ()
    {
        return this._env._p_enableaccessibility;
    };

    //===============================================================
    // nexacro._IconText : Property
    //===============================================================
    _pIconText.set_icon = function (v)
    {
        this._p_icon = v;
        if (v)
        {
            if (this._icon == null || this._icon.value != v)
            {
                var icon = nexacro.UrlObject(v, this);
                this._icon = icon;
                this.on_apply_icon(icon);
            }
        }
        else
        {
            if (this._icon)
            {
                this._icon = null;
                this.on_apply_icon(null);
            }
        }

        this._icon_width = 0;
        this._icon_height = 0;
    };

    _pIconText.on_apply_icon = function (icon)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.setElementIcon(icon || this._getCSSStyleValue("icon", this._status, this._userstatus));
        }
    };

    _pIconText.set_iconPosition = function (v)
    {
        if (this._p_iconPosition != v)
        {
            this._p_iconPosition = v;
            this.on_apply_iconPosition(v);
        }
    };

    _pIconText.on_apply_iconPosition = function (iconpos)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.setElementIconPos(iconpos || this._getCSSStyleValue("iconPosition", this._status, this._userstatus));
        }
    };

    _pIconText.set_textPadding = function (v)
    {
        this._p_textPadding = v;
        if (v)
        {
            if (this._textpadding == null || this._textpadding.value != v)
            {
                var textPadding = nexacro.PaddingObject(v);
                this._textpadding = textPadding;
                this.on_apply_textPadding(textPadding);
            }
        }
        else
        {
            if (this._textpadding)
            {
                this._textpadding = null;
                this.on_apply_textPadding(null);
            }
        }
    };

    _pIconText.on_apply_textPadding = function (textPadding)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.setElementTextPadding(textPadding || this._getCSSStyleValue("textPadding", this._status, this._userstatus));
        }
    };

    _pIconText.set_textwidth = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v))
            {
                return;
            }
        }

        if (this._p_textwidth != v)
        {
            this._p_textwidth = v;
            this.on_apply_textwidth(v);
        }
    };

    _pIconText.on_apply_textwidth = function (textwidth)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.setElementTextWidth(textwidth);
        }
    };

    _pIconText.on_apply_text = function (text)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            if (this._usedecoratetext)
                cellElem.setElementDecorateText(this._displaytext);
            else
                cellElem.setElementText(text);
        }

        if (this._env._p_enableaccessibility)
        {
            this._setAccessibilityLabel(this._getAccessibilityLabel());
        }
    };

    _pIconText.on_apply_textAlign = function (halign)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.setElementTextAlign(halign);
        }
    };

    _pIconText.on_apply_verticalAlign = function (valign)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.setElementVerticalAlign(valign);
        }
    };

    _pIconText.on_apply_wordWrap = function (wordwrap)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.setElementWordWrap(wordwrap);

            if (this._p_fittocontents != "none")
                this._update_position();
        }
    };

    _pIconText.on_apply_textDecoration = function (textDecoration)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.setElementTextDecoration(textDecoration);
        }
    };

    _pIconText._properties = [{ name: "icon" }, { name: "iconPosition" }, { name: "textPadding" }, { name: "textwidth" }];
    nexacro._defineProperties(_pIconText, _pIconText._properties);

    //===============================================================
    // nexacro._IconText : Event Handler
    //===============================================================
    _pIconText._on_icon_onload = function (url, width, height)
    {
        if (this._p_fittocontents !== "none" && (this._icon_width != width || this._icon_height != height))
        {
            this._icon_width = width;
            this._icon_height = height;

            this._update_position();
        }
    };

    //===============================================================
    // nexacro._IconText : Util Function
    //===============================================================
    _pIconText._getCurrentIcon = function ()
    {
        var cellElem = this._cell_elem;
        if (cellElem)
            return cellElem.icon;

        return null;
    };

    _pIconText = null;
}

if (!nexacro._IconText)
{
    //==============================================================================
    // nexacro._IconText
    //==============================================================================
    nexacro._IconText = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pIconText = nexacro._createPrototype(nexacro.Component, nexacro._IconText);
    nexacro._IconText.prototype = _pIconText;
    _pIconText._type_name = "IconText";

    /* default properties */
    _pIconText._p_text = "";
    _pIconText._p_icon = "";
    _pIconText._p_iconPosition = "";
    _pIconText._p_textPadding = "";
    _pIconText._p_textwidth = undefined;
    _pIconText._p_tabstop = false;
    _pIconText._p_iconAnimation = "";
    _pIconText._p_iconAnimationPlayState = "";
    _pIconText._p_iconTransform = "";
    _pIconText._p_iconTransformOrigin = "";
    _pIconText._p_iconTransition = "";
    _pIconText._p_textAnimation = "";
    _pIconText._p_textAnimationPlayState = "";
    _pIconText._p_textTransform = "";
    _pIconText._p_textTransformOrigin = "";
    _pIconText._p_textTransition = "";

    /* internal variable */
    _pIconText._textpadding = null;
    _pIconText._iconAnimation = null;
    _pIconText._iconAnimationPlayState = null;
    _pIconText._iconTransform = null;
    _pIconText._iconTransformOrigin = null;
    _pIconText._iconTransition = null;
    _pIconText._textAnimation = null;
    _pIconText._textAnimationPlayState = null;
    _pIconText._textTransform = null;
    _pIconText._textTransformOrigin = null;
    _pIconText._textTransition = null;

    /* status */
    _pIconText._is_focus_accept = false;
    _pIconText._is_icontext_control = true;
    _pIconText._is_eventinfo_control = false;
    _pIconText._is_fiticonsize = false;
    _pIconText._icon_width = 0;
    _pIconText._icon_height = 0;
    _pIconText._usedecoratetext = false;

    /* accessibility */
    _pIconText._p_accessibilityrole = "none";

    //===============================================================
    // nexacro._IconText : Create & Destroy & Update 
    //===============================================================
    _pIconText.on_create_normal_control_element = function (parent_elem)
    {
        // create control element
        const control_elem = new nexacro.IconTextControlElement(parent_elem);
        if (control_elem)
            control_elem.setLinkedControl(this);

        this._control_element = control_elem;

        return control_elem;
    };

    _pIconText.on_create_contents = function ()
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            if (this._p_textAlign)
                control_elem.setElementTextAlign(this._p_textAlign);
            if (this._p_verticalAlign)
                control_elem.setElementVerticalAlign(this._p_verticalAlign);

            if (this._p_wordWrap)
                control_elem.setElementWordWrap(this._p_wordWrap);
            else
                control_elem.setElementCSSMapWordWrapInfo(this._getCSSStyleValue("wordWrap"));

            if (this._p_textOverflow)
                control_elem.setElementTextOverflow(this._p_textOverflow);
            else
                control_elem.setElementCSSMapTextOverflowInfo(this._getCSSStyleValue("textOverflow"));

            const textPadding = this._textpadding || this._getCSSStyleValue("textPadding");
            if (textPadding)
                control_elem.setElementTextPadding(textPadding);

            if (this._p_textwidth != null)
                control_elem.setElementTextWidth(this._p_textwidth);

            if (this._textdecoration)
                control_elem.setElementTextDecoration(this._textdecoration);

            if (this._displaytext)
            {
                if (this._usedecoratetext)
                    control_elem.setElementDecorateText(this._displaytext);
                else
                    control_elem.setElementText(this._displaytext);
            }

            if (this._iconAnimation)
                control_elem.setElementIconAnimation(this._iconAnimation);
            if (this._iconAnimationPlayState)
                control_elem.setElementIconAnimationPlayState(this._iconAnimationPlayState);
            if (this._iconTransform)
                control_elem.setElementIconTransform(this._iconTransform);
            if (this._iconTransformOrigin)
                control_elem.setElementIconTransformOrigin(this._iconTransformOrigin);
            if (this._iconTransition)
                control_elem.setElementIconTransition(this._iconTransition);
            if (this._textAnimation)
                control_elem.setElementTextAnimation(this._textAnimation);
            if (this._textAnimationPlayState)
                control_elem.setElementTextAnimationPlayState(this._textAnimationPlayState);
            if (this._textTransform)
                control_elem.setElementTextTransform(this._textTransform);
            if (this._textTransformOrigin)
                control_elem.setElementTextTransformOrigin(this._textTransformOrigin);
            if (this._textTransition)
                control_elem.setElementTextTransition(this._textTransition);

            const icon = this._icon || this._getCSSStyleValue("icon");
            if (icon)
                control_elem.setElementIcon(icon);

            const icon_pos = this._p_iconPosition || this._getCSSStyleValue("iconPosition");
            control_elem.setElementIconPos(icon_pos);
            if (this._p_fittocontents != "none")
                this._on_apply_fittocontents();
        }
    };

    _pIconText.on_created_contents = function (win)
    {
        if (this._p_expr)
            this._on_apply_expr(this._p_expr);

        if (this._p_fittocontents != "none")
        {
            this._update_position();
            //this._on_apply_fittocontents();
        }
    };

    _pIconText.on_destroy_contents = function ()
    {
        if (this._textpadding)
            this._textpadding = null;

        if (this._icon)
            this._icon = null;
    };

    _pIconText.on_create_contents_command = function ()
    {
        if (this._p_expr)
            this._on_apply_expr(this._p_expr);

        return "";
    };

    _pIconText.on_attach_contents_handle = function (win)
    {
        if (this._p_fittocontents != "none")
        {
            this._update_position();
        }
    };

    //===============================================================
    // nexacro._IconText : Override
    //===============================================================	
    _pIconText.on_apply_status = function (status, userstatus)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            if (!this._p_textPadding)
                control_elem.setElementTextPadding(this._getCSSStyleValue("textPadding", status, userstatus));
            if (!this._p_icon)
                control_elem.setElementIcon(this._getCSSStyleValue("icon", status, userstatus));
            if (!this._p_iconPosition)
                control_elem.setElementIconPos(this._getCSSStyleValue("iconPosition", status, userstatus));
            if (!this._p_wordWrap)
                control_elem.setElementCSSMapWordWrapInfo(this._getCSSStyleValue("wordWrap", status, userstatus));
            if (!this._p_textOverflow)
                control_elem.setElementCSSMapTextOverflowInfo(this._getCSSStyleValue("textOverflow", status, userstatus));
        }
    };

    _pIconText._on_getFitSize = function ()
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            let total_w = 0;
            let total_h = 0;

            const border = this._getCurrentStyleBorder();
            if (border)
            {
                total_w += border._getBorderWidth();
                total_h += border._getBorderHeight();
            }

            const padding = this._getCurrentStylePadding();
            if (padding)
            {
                total_w += padding.left + padding.right;
                total_h += padding.top + padding.bottom;
            }

            const border_padding_w = total_w;
            const border_padding_h = total_h;

            let text;
            if (this._displaytext && this._displaytext !== "")
            {
                // apply_text로 처리된 대상 기준으로 fittocontects가 이루어져야 함
                text = this._displaytext;
            }
            else
                text = this._p_text;
            if (text)
            {
                const font = this._getCurrentStyleInheritValue("font");
                const refer_font = this._getReferenceAbsoluteFont(font); // use to em / rem
                const wordspace = this._getCurrentStyleInheritValue("wordSpacing");
                const letterspace = this._getCurrentStyleInheritValue("letterSpacing");
                const textpadding = this._textpadding || this._getCSSStyleValue("textPadding");

                let wordwrap = "none";
                let width;

                let multiline = false;
                if (text.search("\n") > -1)
                {
                    multiline = true;
                }

                if (this._p_fittocontents == "height")
                {
                    wordwrap = this._p_wordWrap || this._getCSSStyleValue("wordWrap");
                    if (wordwrap && wordwrap != "none")
                        multiline = true;

                    width = this._adjust_width - total_w;
                }

                const text_size = nexacro._getTextSize(text, font, multiline, width, wordwrap, wordspace, letterspace, this._usedecoratetext, undefined, undefined, refer_font);

                total_w += Math.ceil(this._p_textwidth != null ? this._p_textwidth : text_size[0]);
                total_h += Math.ceil(text_size[1]);

                if (textpadding)
                {
                    total_w += textpadding.left + textpadding.right;
                    total_h += textpadding.top + textpadding.bottom;
                }
            }

            const icon = this._icon || this._getCSSStyleValue("icon");
            if (icon)
            {
                const icon_pos = this._p_iconPosition || this._getCSSStyleValue("iconPosition");

                let icon_size;
                if (this._icon_width != 0 && this._icon_height != 0)
                {
                    icon_size = { width: this._icon_width, height: this._icon_height };
                }
                else
                {
                    icon_size = nexacro._getImageSize(icon.url, this._on_icon_onload, this, undefined, this.image) || { width: this._icon_width, height: this._icon_height };
                }

                if (icon_pos == "top" || icon_pos == "bottom")
                {
                    total_h += icon_size.height;
                    total_w = Math.max(total_w, icon_size.width + border_padding_w);
                }
                else
                {
                    total_w += icon_size.width;
                    total_h = Math.max(total_h, icon_size.height + border_padding_h);
                }
            }
            return [total_w, total_h];
        }

        return [this._adjust_width, this._adjust_height];
    };

    _pIconText._isFocusAcceptable = function ()
    {
        return this._env._p_enableaccessibility;
    };

    //===============================================================
    // nexacro._IconText : Property
    //===============================================================
    _pIconText.set_icon = function (v)
    {
        this._p_icon = v;
        if (v)
        {
            if (this._icon == null || this._icon.value != v)
            {
                const icon = nexacro.UrlObject(v, this);
                this._icon = icon;
                this.on_apply_icon(icon);
            }
        }
        else
        {
            if (this._icon)
            {
                this._icon = null;
                this.on_apply_icon(null);
            }
        }

        this._icon_width = 0;
        this._icon_height = 0;
    };

    _pIconText.on_apply_icon = function (icon)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementIcon(icon || this._getCSSStyleValue("icon", this._status, this._userstatus));
        }
    };

    _pIconText.set_iconPosition = function (v)
    {
        if (this._p_iconPosition != v)
        {
            this._p_iconPosition = v;
            this.on_apply_iconPosition(v);
        }
    };

    _pIconText.on_apply_iconPosition = function (iconpos)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementIconPos(iconpos || this._getCSSStyleValue("iconPosition", this._status, this._userstatus));
        }
    };

    _pIconText.set_iconAnimation = function (v)
    {
        this._p_iconanimation = v;
        if (v)
        {
            if (this._iconAnimation == null || this._iconAnimation.value != v)
            {
                const animation = nexacro.AnimationObject(v);
                this._iconAnimation = animation;
                this.on_apply_iconAnimation(animation);
            }
        }
        else
        {
            if (this._iconAnimation)
            {
                this._iconAnimation = null;
                this.on_apply_iconAnimation(null);
            }
        }
    };

    _pIconText.on_apply_iconAnimation = nexacro._queueAnimationFrame(function (iconAnimation)
    {      
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementIconAnimation(iconAnimation);
        }
    });

    _pIconText.set_iconAnimationPlayState = function (v)
    {
        this._p_iconAnimationPlayState = v;
        if (v)
        {
            if (this._iconAnimationPlayState == null || this._iconAnimationPlayState.value != v)
            {
                const animationPlayState = nexacro.AnimationPlayStateObject(v);
                this._iconAnimationPlayState = animationPlayState;
                this.on_apply_iconAnimationPlayState(animationPlayState);
            }
        }
        else
        {
            if (this._iconAnimationPlayState)
            {
                this._iconAnimationPlayState = null;
                this.on_apply_iconAnimationPlayState(null);
            }
        }
    };

    _pIconText.on_apply_iconAnimationPlayState = function (iconAnimationPlayState)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementIconAnimationPlayState(iconAnimationPlayState);
        }
    };

    _pIconText.set_iconTransform = function (v)
    {
        this._p_iconTransform = v;
        if (v)
        {
            if (this._iconTransform == null || this._iconTransform.value != v)
            {
                const iconTransform = nexacro.TransformObject(v);
                this._iconTransform = iconTransform;
                this.on_apply_iconTransform(iconTransform);
            }
        }
        else
        {
            if (this._iconTransform)
            {
                this._iconTransform = null;
                this.on_apply_iconTransform(null);
            }
        }
    };

    _pIconText.on_apply_iconTransform = function (iconTransform)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementIconTransform(iconTransform);
        }
    };

    _pIconText.set_iconTransformOrigin = function (v)
    {
        this._p_iconTransformOrigin = v;
        if (v)
        {
            if (this._iconTransformOrigin == null || this._iconTransformOrigin.value != v)
            {
                const iconTransformOrigin = nexacro.TransformOriginObject(v);
                this._iconTransformOrigin = iconTransformOrigin;
                this.on_apply_iconTransformOrigin(iconTransformOrigin);
            }
        }
        else
        {
            if (this._iconTransformOrigin)
            {
                this._iconTransformOrigin = null;
                this.on_apply_iconTransformOrigin(null);
            }
        }
    };

    _pIconText.on_apply_iconTransformOrigin = function (iconTransformOrigin)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementIconTransformOrigin(iconTransformOrigin);
        }
    };

    _pIconText.set_iconTransition = function (v)
    {
        this._p_iconTransition = v;
        if (v)
        {
            if (this._iconTransition == null || this._iconTransition.value != v)
            {
                const transition = nexacro.TransitionObject(v);
                this._iconTransition = transition;
                this.on_apply_iconTransition(transition);
            }
        }
        else
        {
            if (this._iconTransition)
            {
                this._iconTransition = null;
                this.on_apply_iconTransition(null);
            }
        }
    };

    _pIconText.on_apply_iconTransition = function (iconTransition)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementIconTransition(iconTransition);
        }
    };

    _pIconText.set_textAnimation = function (v)
    {
        this._p_textAnimation = v;
        if (v)
        {
            if (this._textAnimation == null || this._textAnimation.value != v)
            {
                const animation = nexacro.AnimationObject(v);
                this._textAnimation = animation;
                this.on_apply_textAnimation(animation);
            }
        }
        else
        {
            if (this._textAnimation)
            {
                this._textAnimation = null;
                this.on_apply_textAnimation(null);
            }
        }
    };

    _pIconText.on_apply_textAnimation = nexacro._queueAnimationFrame(function (textAnimation)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextAnimation(textAnimation);
        }
    });

    _pIconText.set_textAnimationPlayState = function (v)
    {
        this._p_textAnimationPlayState = v;
        if (v)
        {
            if (this._textAnimationPlayState == null || this._textAnimationPlayState.value != v)
            {
                const animationPlayState = nexacro.AnimationPlayStateObject(v);
                this._textAnimationPlayState = animationPlayState;
                this.on_apply_textAnimationPlayState(animationPlayState);
            }
        }
        else
        {
            if (this._textAnimationPlayState)
            {
                this._textAnimationPlayState = null;
                this.on_apply_textAnimationPlayState(null);
            }
        }
    };

    _pIconText.on_apply_textAnimationPlayState = function (textAnimationPlayState)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextAnimationPlayState(textAnimationPlayState);
        }
    };

    _pIconText.set_textTransform = function (v)
    {
        this._p_textTransform = v;
        if (v)
        {
            if (this._textTransform == null || this._textTransform.value != v)
            {
                const textTransform = nexacro.TransformObject(v);
                this._textTransform = textTransform;
                this.on_apply_textTransform(textTransform);
            }
        }
        else
        {
            if (this._textTransform)
            {
                this._textTransform = null;
                this.on_apply_textTransform(null);
            }
        }
    };

    _pIconText.on_apply_textTransform = function (textTransform)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextTransform(textTransform);
        }
    };

    _pIconText.set_textTransformOrigin = function (v)
    {
        this._p_textTransformOrigin = v;
        if (v)
        {
            if (this._textTransformOrigin == null || this._textTransformOrigin.value != v)
            {
                var textTransformOrigin = nexacro.TransformOriginObject(v);
                this._textTransformOrigin = textTransformOrigin;
                this.on_apply_textTransformOrigin(textTransformOrigin);
            }
        }
        else
        {
            if (this._textTransformOrigin)
            {
                this._textTransformOrigin = null;
                this.on_apply_textTransformOrigin(null);
            }
        }
    };

    _pIconText.on_apply_textTransformOrigin = function (textTransformOrigin)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextTransformOrigin(textTransformOrigin);
        }
    };

    _pIconText.set_textTransition = function (v)
    {
        this._p_textTransition = v;
        if (v)
        {
            if (this._textTransition == null || this._textTransition.value != v)
            {
                const transition = nexacro.TransitionObject(v);
                this._textTransition = transition;
                this.on_apply_textTransition(transition);
            }
        }
        else
        {
            if (this._textTransition)
            {
                this._textTransition = null;
                this.on_apply_textTransition(null);
            }
        }
    };

    _pIconText.on_apply_textTransition = function (textTransition)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextTransition(textTransition);
        }
    };

    _pIconText.set_textPadding = function (v)
    {
        this._p_textPadding = v;
        if (v)
        {
            if (this._textpadding == null || this._textpadding.value != v)
            {
                const textPadding = nexacro.PaddingObject(v);
                this._textpadding = textPadding;
                this.on_apply_textPadding(textPadding);
            }
        }
        else
        {
            if (this._textpadding)
            {
                this._textpadding = null;
                this.on_apply_textPadding(null);
            }
        }
    };

    _pIconText.on_apply_textPadding = function (textPadding)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextPadding(textPadding || this._getCSSStyleValue("textPadding", this._status, this._userstatus));
        }
    };

    _pIconText.set_textwidth = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v))
            {
                return;
            }
        }

        if (this._p_textwidth != v)
        {
            this._p_textwidth = v;
            this.on_apply_textwidth(v);
        }
    };

    _pIconText.on_apply_textwidth = function (textwidth)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextWidth(textwidth);
        }
    };

    _pIconText.on_apply_text = function (text)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            if (this._usedecoratetext)
                control_elem.setElementDecorateText(this._displaytext);
            else
                control_elem.setElementText(text);
        }

        if (this._env._p_enableaccessibility)
        {
            this._setAccessibilityLabel(this._getAccessibilityLabel());
        }
    };

    _pIconText.on_apply_textAlign = function (halign)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextAlign(halign);
        }
    };

    _pIconText.on_apply_verticalAlign = function (valign)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementVerticalAlign(valign);
        }
    };

    _pIconText.on_apply_wordWrap = function (wordwrap)
    {
         const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementWordWrap(wordwrap);

            if (this._p_fittocontents != "none")
                this._update_position();
        }
    };

    _pIconText.on_apply_textOverflow = function (textoverflow)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextOverflow(textoverflow);
        }
    };

    _pIconText.on_apply_textDecoration = function (textDecoration)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextDecoration(textDecoration);
        }
    };

    _pIconText._properties = [{ name: "icon" }, { name: "iconPosition" }, { name: "textPadding" }, { name: "textwidth" },
        { name: "iconAnimation" }, { name: "iconAnimationPlayState" }, { name: "iconTransform" }, { name: "iconTransformOrigin" }, { name: "iconTransition" },
        { name: "textAnimation" }, { name: "textAnimationPlayState" }, { name: "textTransform" }, { name: "textTransformOrigin" }, { name: "textTransition" }
    ];
    nexacro._defineProperties(_pIconText, _pIconText._properties);

    //===============================================================
    // nexacro._IconText : Event Handler
    //===============================================================
    _pIconText._on_icon_onload = function (url, width, height)
    {
        if (this._p_fittocontents !== "none" && (this._icon_width != width || this._icon_height != height))
        {
            this._icon_width = width;
            this._icon_height = height;

            this._update_position();
        }
    };

    //===============================================================
    // nexacro._IconText : Util Function
    //===============================================================
    _pIconText._getCurrentIcon = function ()
    {
        const control_elem = this.getElement();
        if (control_elem)
            return control_elem.icon;

        return null;
    };

    _pIconText = null;
}

if (!nexacro._Icon && nexacro._use_legacy_icontext)
{
    //==============================================================================
    // nexacro._Icon
    //==============================================================================
    nexacro._Icon = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pIcon = nexacro._createPrototype(nexacro.Component, nexacro._Icon);
    nexacro._Icon.prototype = _pIcon;
    _pIcon._type_name = "Icon";

    /* element */
    _pIcon._cell_elem = null;

    /* default properties */
    _pIcon._p_icon = "";
    _pIcon._p_padding = "";
    _pIcon._p_textAlign = "";
    _pIcon._p_verticalAlign = "";
    _pIcon._p_tabstop = false;

    /* internal variable */
    _pIcon._icon = null;

    /* status */
    _pIcon._is_focus_accept = false;
    _pIcon._is_simple_control = true;
    _pIcon._is_eventinfo_control = false;
    _pIcon._is_fiticonsize = false;

    _pIcon._p_accessibilityrole = "Icon";

    //===============================================================
    // nexacro._Icon : Create & Destroy & Update 
    //===============================================================
    _pIcon.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var cellElem = new nexacro.IconElement(control_elem, "icon", this._is_fiticonsize);
            this._cell_elem = cellElem;

            cellElem.setElementPosition(this._getClientLeft(), this._getClientTop());
            cellElem.setElementSize(control_elem.client_width, control_elem.client_height);

            // apply non-inherited style-props
            // css Generation code & generate Icon._padding_info/Icon._align_info to css (.Icon .nexaText { padding/text-align/vertical-align })

            if (this._p_textAlign)
                cellElem.setElementTextAlign(this._p_textAlign);
            if (this._p_verticalAlign)
                cellElem.setElementVerticalAlign(this._p_verticalAlign);

            var icon = this._icon || this._getCSSStyleValue("icon");
            if (icon)
            {
                cellElem.setElementIcon(icon);
            }
            if (this._p_fittocontents != "none")
                this._on_apply_fittocontents();
        }
    };

    _pIcon.on_created_contents = function (win)
    {
        if (this._p_fittocontents != "none")
        {
            this._update_position();
        }

        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.create(win);
        }
    };

    _pIcon.on_destroy_contents = function ()
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.destroy();
            this._cell_elem = null;
        }

        if (this._icon)
            this._icon = null;
    };

    _pIcon.on_create_contents_command = function ()
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            return cellElem.createCommand();
        }

        return "";
    };

    _pIcon.on_attach_contents_handle = function (win)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.attachHandle(win);
        }

        if (this._p_fittocontents != "none")
        {
            this._update_position();
        }
    };

    _pIcon.on_change_containerRect = function (width, height)
    {
        if (this._is_created_contents)
        {
            var cellElem = this._cell_elem;
            cellElem.setElementSize(width, height);
        }
    };

    _pIcon.on_change_containerPos = function (left, top)
    {
        if (this._is_created_contents)
        {
            var cellElem = this._cell_elem;
            cellElem.setElementPosition(left, top);
        }
    };

    //===============================================================
    // nexacro._Icon : Override
    //===============================================================
    _pIcon.on_apply_status = function (status, userstatus)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            if (!this._p_icon)
                cellElem.setElementIcon(this._getCSSStyleValue("icon", status, userstatus));
        }
    };

    _pIcon._on_getFitSize = function ()
    {
        var elem = this.getElement();
        if (elem)
        {
            var total_w = 0;
            var total_h = 0;

            var border = this._getCurrentStyleBorder();
            if (border)
            {
                total_w += border._getBorderWidth();
                total_h += border._getBorderHeight();
            }

            var padding = this._getCurrentStylePadding();
            if (padding)
            {
                total_w += padding.left + padding.right;
                total_h += padding.top + padding.bottom;
            }

            var icon = this._icon || this._getCSSStyleValue("icon");
            if (icon)
            {
                var icon_pos = this._p_iconPosition || this._getCSSStyleValue("iconPosition");
                var icon_size = nexacro._getImageSize(icon.url, this._on_icon_onload, this, undefined, this.image) || { width: 0, height: 0 };

                if (icon_pos == "left" || icon_pos == "right")
                {
                    total_w += icon_size.width;
                    total_h = Math.max(total_h, icon_size.height);
                }
                else
                {
                    total_h += icon_size.height;
                    total_w = Math.max(total_w, icon_size.width);
                }
            }

            return [total_w, total_h];
        }

        return [this._adjust_width, this._adjust_height];
    };

    _pIcon._isFocusAcceptable = function ()
    {
        return this._env._p_enableaccessibility;
    };

    //===============================================================
    // nexacro._Icon : Property
    //===============================================================
    _pIcon.set_icon = function (v)
    {
        this._p_icon = v;
        if (v)
        {
            if (this._icon == null || this._icon.value != v)
            {
                var icon = nexacro.UrlObject(v, this);
                this._icon = icon;
                this.on_apply_icon(icon);
            }
        }
        else
        {
            if (this._icon)
            {
                this._icon = null;
                this.on_apply_icon(null);
            }
        }
    };

    _pIcon.on_apply_icon = function (icon)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.setElementIcon(icon || this._getCSSStyleValue("icon", this._status, this._userstatus));
        }
    };

    _pIcon.on_apply_textAlign = function (halign)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.setElementTextAlign(halign);
        }
    };

    _pIcon.on_apply_verticalAlign = function (valign)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.setElementVerticalAlign(valign);
        }
    };

    _pIcon._properties = [{ name: "icon" }];
    nexacro._defineProperties(_pIcon, _pIcon._properties);

    //===============================================================
    // nexacro._Icon : Event Handler
    //===============================================================
    _pIcon._on_icon_onload = function (url, width, height)
    {
        if (this._p_fittocontents !== "none")
        {
            this._update_position();
        }
    };

    //===============================================================
    // nexacro._Icon : Util Function
    //===============================================================
    _pIcon._getCurrentIcon = function ()
    {
        var cellElem = this._cell_elem;
        if (cellElem)
            return cellElem.icon;

        return null;
    };

    _pIcon = null;
}

if (!nexacro._Icon)
{
    //==============================================================================
    // nexacro._Icon
    //==============================================================================
    nexacro._Icon = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pIcon = nexacro._createPrototype(nexacro.Component, nexacro._Icon);
    nexacro._Icon.prototype = _pIcon;
    _pIcon._type_name = "Icon";

    /* default properties */
    _pIcon._p_icon = "";
    _pIcon._p_padding = "";
    _pIcon._p_textAlign = "";
    _pIcon._p_verticalAlign = "";
    _pIcon._p_tabstop = false;
    _pIcon._p_iconAnimation = "";
    _pIcon._p_iconAnimationPlayState = "";
    _pIcon._p_iconTransform = "";
    _pIcon._p_iconTransformOrigin = "";
    _pIcon._p_iconTransition = "";

    /* internal variable */
    _pIcon._icon = null;
    _pIcon._iconAnimation = null;
    _pIcon._iconAnimationPlayState = null;
    _pIcon._iconTransform = null;
    _pIcon._iconTransformOrigin = null;
    _pIcon._iconTransition = null;

    /* status */
    _pIcon._is_focus_accept = false;
    _pIcon._is_simple_control = true;
    _pIcon._is_eventinfo_control = false;
    _pIcon._is_fiticonsize = false;

    _pIcon._p_accessibilityrole = "Icon";

    //===============================================================
    // nexacro._Icon : Create & Destroy & Update 
    //===============================================================
    _pIcon.on_create_normal_control_element = function (parent_elem)
    {
        // create control element
        const control_elem = new nexacro.IconTextControlElement(parent_elem);
        if (control_elem)
            control_elem.setLinkedControl(this);

        this._control_element = control_elem;

        return control_elem;
    };

    _pIcon.on_create_contents = function ()
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            if (this._p_textAlign)
                control_elem.setElementTextAlign(this._p_textAlign);
            if (this._p_verticalAlign)
                control_elem.setElementVerticalAlign(this._p_verticalAlign);

            if (this._iconAnimation)
                control_elem.setElementIconAnimation(this._iconAnimation);
            if (this._iconAnimationPlayState)
                control_elem.setElementIconAnimationPlayState(this._iconAnimationPlayState);
            if (this._iconTransform)
                control_elem.setElementIconTransform(this._iconTransform);
            if (this._iconTransformOrigin)
                control_elem.setElementIconTransformOrigin(this._iconTransformOrigin);
            if (this._iconTransition)
                control_elem.setElementIconTransition(this._iconTransition);

            const icon = this._icon || this._getCSSStyleValue("icon");
            if (icon)
            {
                control_elem.setElementIcon(icon);
            }
            if (this._p_fittocontents != "none")
                this._on_apply_fittocontents();
        }
    };

    _pIcon.on_created_contents = function (win)
    {
        if (this._p_fittocontents != "none")
        {
            this._update_position();
        }
    };

    _pIcon.on_destroy_contents = function ()
    {
        if (this._icon)
            this._icon = null;
    };

    _pIcon.on_create_contents_command = function ()
    {
        return "";
    };

    _pIcon.on_attach_contents_handle = function (win)
    {
        if (this._p_fittocontents != "none")
        {
            this._update_position();
        }
    };

    //===============================================================
    // nexacro._Icon : Override
    //===============================================================
    _pIcon.on_apply_status = function (status, userstatus)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            if (!this._p_icon)
                control_elem.setElementIcon(this._getCSSStyleValue("icon", status, userstatus));
        }
    };

    _pIcon._on_getFitSize = function ()
    {
        const elem = this.getElement();
        if (elem)
        {
            let total_w = 0;
            let total_h = 0;

            const border = this._getCurrentStyleBorder();
            if (border)
            {
                total_w += border._getBorderWidth();
                total_h += border._getBorderHeight();
            }

            const padding = this._getCurrentStylePadding();
            if (padding)
            {
                total_w += padding.left + padding.right;
                total_h += padding.top + padding.bottom;
            }

            const icon = this._icon || this._getCSSStyleValue("icon");
            if (icon)
            {
                const icon_pos = this._p_iconPosition || this._getCSSStyleValue("iconPosition");
                const icon_size = nexacro._getImageSize(icon.url, this._on_icon_onload, this, undefined, this.image) || { width: 0, height: 0 };

                if (icon_pos == "left" || icon_pos == "right")
                {
                    total_w += icon_size.width;
                    total_h = Math.max(total_h, icon_size.height);
                }
                else
                {
                    total_h += icon_size.height;
                    total_w = Math.max(total_w, icon_size.width);
                }
            }

            return [total_w, total_h];
        }

        return [this._adjust_width, this._adjust_height];
    };

    _pIcon._isFocusAcceptable = function ()
    {
        return this._env._p_enableaccessibility;
    };

    //===============================================================
    // nexacro._Icon : Property
    //===============================================================
    _pIcon.set_icon = function (v)
    {
        this._p_icon = v;
        if (v)
        {
            if (this._icon == null || this._icon.value != v)
            {
                const icon = nexacro.UrlObject(v, this);
                this._icon = icon;
                this.on_apply_icon(icon);
            }
        }
        else
        {
            if (this._icon)
            {
                this._icon = null;
                this.on_apply_icon(null);
            }
        }
    };

    _pIcon.on_apply_icon = function (icon)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementIcon(icon || this._getCSSStyleValue("icon", this._status, this._userstatus));
        }
    };

    _pIcon.on_apply_textAlign = function (halign)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextAlign(halign);
        }
    };

    _pIcon.on_apply_verticalAlign = function (valign)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementVerticalAlign(valign);
        }
    };

    _pIcon.set_iconAnimation = function (v)
    {
        this._p_iconanimation = v;
        if (v)
        {
            if (this._iconAnimation == null || this._iconAnimation.value != v)
            {
                const animation = nexacro.AnimationObject(v);
                this._iconAnimation = animation;
                this.on_apply_iconAnimation(animation);
            }
        }
        else
        {
            if (this._iconAnimation)
            {
                this._iconAnimation = null;
                this.on_apply_iconAnimation(null);
            }
        }
    };

    _pIcon.on_apply_iconAnimation = nexacro._queueAnimationFrame(function (iconAnimation)
    {      
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementIconAnimation(iconAnimation);
        }
    });

    _pIcon.set_iconAnimationPlayState = function (v)
    {
        this._p_iconAnimationPlayState = v;
        if (v)
        {
            if (this._iconAnimationPlayState == null || this._iconAnimationPlayState.value != v)
            {
                const animationPlayState = nexacro.AnimationPlayStateObject(v);
                this._iconAnimationPlayState = animationPlayState;
                this.on_apply_iconAnimationPlayState(animationPlayState);
            }
        }
        else
        {
            if (this._iconAnimationPlayState)
            {
                this._iconAnimationPlayState = null;
                this.on_apply_iconAnimationPlayState(null);
            }
        }
    };

    _pIcon.on_apply_iconAnimationPlayState = function (iconAnimationPlayState)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementIconAnimationPlayState(iconAnimationPlayState);
        }
    };

    _pIcon.set_iconTransform = function (v)
    {
        this._p_iconTransform = v;
        if (v)
        {
            if (this._iconTransform == null || this._iconTransform.value != v)
            {
                const iconTransform = nexacro.TransformObject(v);
                this._iconTransform = iconTransform;
                this.on_apply_iconTransform(iconTransform);
            }
        }
        else
        {
            if (this._iconTransform)
            {
                this._iconTransform = null;
                this.on_apply_iconTransform(null);
            }
        }
    };

    _pIcon.on_apply_iconTransform = function (iconTransform)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementIconTransform(iconTransform);
        }
    };

    _pIcon.set_iconTransformOrigin = function (v)
    {
        this._p_iconTransformOrigin = v;
        if (v)
        {
            if (this._iconTransformOrigin == null || this._iconTransformOrigin.value != v)
            {
                const iconTransformOrigin = nexacro.TransformOriginObject(v);
                this._iconTransformOrigin = iconTransformOrigin;
                this.on_apply_iconTransformOrigin(iconTransformOrigin);
            }
        }
        else
        {
            if (this._iconTransformOrigin)
            {
                this._iconTransformOrigin = null;
                this.on_apply_iconTransformOrigin(null);
            }
        }
    };

    _pIcon.on_apply_iconTransformOrigin = function (iconTransformOrigin)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementIconTransformOrigin(iconTransformOrigin);
        }
    };

    _pIcon.set_iconTransition = function (v)
    {
        this._p_iconTransition = v;
        if (v)
        {
            if (this._iconTransition == null || this._iconTransition.value != v)
            {
                const transition = nexacro.TransitionObject(v);
                this._iconTransition = transition;
                this.on_apply_iconTransition(transition);
            }
        }
        else
        {
            if (this._iconTransition)
            {
                this._iconTransition = null;
                this.on_apply_iconTransition(null);
            }
        }
    };

    _pIcon.on_apply_iconTransition = function (iconTransition)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementIconTransition(iconTransition);
        }
    };

    _pIcon._properties = [{ name: "icon" }, { name: "iconAnimation" }, { name: "iconAnimationPlayState" }, { name: "iconTransform" }, { name: "iconTransformOrigin" }, { name: "iconTransition" }];
    nexacro._defineProperties(_pIcon, _pIcon._properties);

    //===============================================================
    // nexacro._Icon : Event Handler
    //===============================================================
    _pIcon._on_icon_onload = function (url, width, height)
    {
        if (this._p_fittocontents !== "none")
        {
            this._update_position();
        }
    };

    //===============================================================
    // nexacro._Icon : Util Function
    //===============================================================
    _pIcon._getCurrentIcon = function ()
    {
        const control_elem = this.getElement();
        if (control_elem)
            return control_elem.icon;

        return null;
    };

    _pIcon = null;
}

if (!nexacro.Static && nexacro._use_legacy_icontext)
{
    //==============================================================================
    // nexacro.Static
    //==============================================================================
    nexacro.Static = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pStatic = nexacro._createPrototype(nexacro.Component, nexacro.Static);
    nexacro.Static.prototype = _pStatic;
    _pStatic._type_name = "Static";

    /* element */
    _pStatic._cell_elem = null;

    /* default properties */
    _pStatic._p_text = "";
    _pStatic._p_usedecorate = false;
    _pStatic._p_tabstop = false;

    /* status */
    _pStatic._is_focus_accept = false;
    _pStatic._is_simple_control = true;
    _pStatic._apply_client_padding = true;
    _pStatic._is_overflow_visible = false;

    _pStatic._p_accessibilityrole = "static";

    /* event list */
    _pStatic._event_list =
    {
        "onclick": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onlongpress": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmove": 1,
        "onmousedown": 1, "onmouseup": 1,
        "onsize": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
        "oncontextmenu": 1,
        "onrbuttondown": 1, "onrbuttonup": 1
    };

    //===============================================================
    // nexacro.Static : Create & Destroy & Update 
    //===============================================================
    _pStatic.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var cellElem = this._cell_elem = new nexacro.TextBoxElement(control_elem, "text");
            cellElem.setElementPosition(this._getClientLeft(), this._getClientTop());
            cellElem.setElementSize(control_elem.client_width, control_elem.client_height);

            // apply non-inherited style-props
            // css Generation code & generate Static align wordWrap to css (.Static .nexacontentsbox { text-align/vertical-align })

            if (this._p_textAlign)
                cellElem.setElementTextAlign(this._p_textAlign);
            if (this._p_verticalAlign)
                cellElem.setElementVerticalAlign(this._p_verticalAlign);

            var wordwrap_info = this._getCSSStyleValue("wordWrap");
            if (wordwrap_info)
                cellElem.setElementCSSMapInfo(wordwrap_info);

            if (this._p_wordWrap)
                cellElem.setElementWordWrap(this._p_wordWrap);

            // CSS text-decoration
            if (this._textdecoration)
                cellElem.setElementTextDecoration(this._textdecoration);

            if (this._is_overflow_visible)
                cellElem.setElementOverflow(true);

            // Static usedecorate
            if (this._displaytext)
            {
                if (this._p_usedecorate)
                {
                    control_elem.setElementPointerEvents(this._isEnable() ? "" : "none");
                    cellElem.setElementDecorateText(this._getStringResourceProperty(this._p_text));
                }
                else
                    cellElem.setElementText(this._displaytext);
            }

            var fittocontents = this._p_fittocontents;
            if (fittocontents != "none")
            {
                // fittocontents가 width와 both 일때는 적용하지 않음
                if (fittocontents !== "height")
                {
                    cellElem.setElementWordWrap("none");
                }
                this._on_apply_fittocontents();
            }
        }
    };

    _pStatic.on_created_contents = function (win)
    {
        if (this._p_expr)
            this._on_apply_expr(this._p_expr);

        if (this._p_fittocontents != "none")
        {
            this._update_position();
        }

        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.create(win);

            if (this._env._p_enableaccessibility)
            {
                this._on_created_accessibility_contents(win);
            }
        }
    };

    _pStatic.on_destroy_contents = function ()
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.destroy();
            this._cell_elem = null;
        }
    };

    _pStatic.on_create_contents_command = function ()
    {
        if (this._p_expr)
            this._on_apply_expr(this._p_expr);

        var cellElem = this._cell_elem;
        if (cellElem)
        {
            return cellElem.createCommand();
        }

        return "";
    };

    _pStatic.on_attach_contents_handle = function (win)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.attachHandle(win);
        }

        if (this._p_fittocontents != "none")
        {
            this._update_position();
        }

        this._on_attach_accessibility_contents_handle(win);
    };

    _pStatic.on_change_containerRect = function (width, height)
    {
        if (this._is_created_contents)
        {
            var cellElem = this._cell_elem;
            cellElem.setElementSize(width, height);
        }
    };

    _pStatic.on_change_containerPos = function (left, top)
    {
        if (this._is_created_contents)
        {
            var cellElem = this._cell_elem;
            cellElem.setElementPosition(left, top);
        }
    };

    //===============================================================
    // nexacro.Static : Override
    //===============================================================
    _pStatic.on_apply_status = function (status, userstatus)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            var wordwrap_info = this._getCSSStyleValue("wordWrap", status, userstatus);
            if (wordwrap_info)
                cellElem.setElementCSSMapInfo(wordwrap_info);
        }
    };

    _pStatic.on_get_prop_tabstop = function ()
    {
        if (this._env._p_enableaccessibility)
        {
            if (this._p_accessibilityenable && this._p_accessibilityrole == "link")
                return true;
        }

        return false;
    };

    _pStatic._isFocusAcceptable = function ()
    {
        return this._env._p_enableaccessibility;
    };

    _pStatic._on_getFitSize = function ()
    {
        var elem = this.getElement();
        if (elem)
        {
            var total_w = 0;
            var total_h = 0;

            var border = this._getCurrentStyleBorder();
            if (border)
            {
                total_w += border._getBorderWidth();
                total_h += border._getBorderHeight();
            }

            var padding = this._getCurrentStylePadding();
            if (padding)
            {
                total_w += padding.left + padding.right;
                total_h += padding.top + padding.bottom;
            }

            var text;
            if (this._displaytext && this._displaytext !== "")
            {
                // apply_text로 처리된 대상 기준으로 fittocontects가 이루어져야 함
                text = this._displaytext;
            }
            else
                text = this._p_text;
            if (text)
            {
                var font = this._getCurrentStyleInheritValue("font");
                var refer_font = this._getReferenceAbsoluteFont(font); // use to em / rem
                var wordspace = this._getCurrentStyleInheritValue("wordSpacing");
                var letterspace = this._getCurrentStyleInheritValue("letterSpacing");
                var wordwrap = "none";
                var width;

                var multiline = false;
                if (text.search("\n") > -1)
                {
                    multiline = true;
                }

                if (this._p_fittocontents == "height")
                {
                    wordwrap = this._p_wordWrap || this._getCSSStyleValue("wordWrap");
                    if (wordwrap && wordwrap != "none")
                        multiline = true;

                    width = this._adjust_width - total_w;
                }

                var b_decoration = this._p_usedecorate;

                var text_size = nexacro._getTextSize(text, font, multiline, width, wordwrap, wordspace, letterspace, b_decoration, undefined, undefined, refer_font);

                total_w += Math.ceil(this._p_textwidth != null ? this._p_textwidth : text_size[0]);
                total_h += Math.ceil(text_size[1]);
            }

            return [total_w, total_h];
        }

        return [this._adjust_width, this._adjust_height];
    };

    //===============================================================
    // nexacro.Static : Property
    //===============================================================
    _pStatic.set_usedecorate = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_usedecorate != v)
        {
            this._p_usedecorate = v;
            this.on_apply_usedecorate();
        }
    };

    _pStatic.on_apply_usedecorate = function ()
    {
        this._on_apply_text();
    };

    _pStatic.set_textPadding = nexacro._emptyFn;

    _pStatic.on_apply_text = function (text)
    {
        const cellElem = this._cell_elem;

        if (this._p_usedecorate)
        {
            // usedecoreate 속성이 true 이면 displaytext update
            this._displaytext = nexacro._getDisplayTextfromDecorateText(text);

            // label도 update
            if (this._env._p_enableaccessibility)
            {
                this.on_apply_prop_accessibilitylabel();
            }
        }

        if (cellElem)
        {
            if (this._p_usedecorate)
            {
                cellElem.setElementDecorateText(text);
            }
            else
            {
                cellElem.setElementText(text);
            }

            cellElem.setElementPointerEvents();
        }
    };

    _pStatic.on_apply_prop_enable = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementPointerEvents(this._isEnable() ? "" : "none");
        }
    }

    _pStatic.on_apply_textAlign = function (halign)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.setElementTextAlign(halign);
        }
    };

    _pStatic.on_apply_verticalAlign = function (valign)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.setElementVerticalAlign(valign);
        }
    };

    _pStatic.on_apply_wordWrap = function (wordwrap)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            if (this._p_fittocontents != "none")
            {
                cellElem.setElementWordWrap("none");
                this._update_position();
            }
            else
            {
                cellElem.setElementWordWrap(wordwrap);
            }
        }
    };

    _pStatic.on_apply_textDecoration = function (textDecoration)
    {
        var cellElem = this._cell_elem;
        if (cellElem)
        {
            cellElem.setElementTextDecoration(textDecoration);
        }
    };

    _pStatic._properties = [{ name: "usedecorate" }];
    nexacro._defineProperties(_pStatic, _pStatic._properties);

    _pStatic = null;
}

if (!nexacro.Static)
{
    //==============================================================================
    // nexacro.Static
    //==============================================================================
    nexacro.Static = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pStatic = nexacro._createPrototype(nexacro.Component, nexacro.Static);
    nexacro.Static.prototype = _pStatic;
    _pStatic._type_name = "Static";

    /* default properties */
    _pStatic._p_text = "";
    _pStatic._p_textPadding = "";
    _pStatic._p_usedecorate = false;
    _pStatic._p_tabstop = false;
    _pStatic._p_textAnimation = "";
    _pStatic._p_textAnimationPlayState = "";
    _pStatic._p_textTransform = "";
    _pStatic._p_textTransformOrigin = "";
    _pStatic._p_textTransition = "";

    /* internal variable */
    _pStatic._textpadding = null;
    _pStatic._textAnimation = null;
    _pStatic._textAnimationPlayState = null;
    _pStatic._textTransform = null;
    _pStatic._textTransformOrigin = null;
    _pStatic._textTransition = null;

    /* status */
    _pStatic._is_focus_accept = false;
    _pStatic._is_simple_control = true;
    _pStatic._apply_client_padding = true;
    _pStatic._is_overflow_visible = false;

    _pStatic._p_accessibilityrole = "static";

    /* event list */
    _pStatic._event_list =
    {
        "onclick": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onlongpress": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmove": 1,
        "onmousedown": 1, "onmouseup": 1,
        "onsize": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
        "oncontextmenu": 1,
        "onrbuttondown": 1, "onrbuttonup": 1
    };

    //===============================================================
    // nexacro.Static : Create & Destroy & Update 
    //===============================================================
    _pStatic.on_create_normal_control_element = function (parent_elem)
    {
        // create control element
        const control_elem = new nexacro.IconTextControlElement(parent_elem);
        if (control_elem)
            control_elem.setLinkedControl(this);

        this._control_element = control_elem;

        return control_elem;
    };

    _pStatic.on_create_contents = function ()
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            if (this._p_textAlign)
                control_elem.setElementTextAlign(this._p_textAlign);
            if (this._p_verticalAlign)
                control_elem.setElementVerticalAlign(this._p_verticalAlign);

            if (this._p_wordWrap)
                control_elem.setElementWordWrap(this._p_wordWrap);
            else
                control_elem.setElementCSSMapWordWrapInfo(this._getCSSStyleValue("wordWrap"));

            if (this._p_textOverflow)
                control_elem.setElementTextOverflow(this._p_textOverflow);
            else
                control_elem.setElementCSSMapTextOverflowInfo(this._getCSSStyleValue("textOverflow"));

            const textPadding = this._textpadding || this._getCSSStyleValue("textPadding");
            if (textPadding)
                control_elem.setElementTextPadding(textPadding);

            // CSS text-decoration
            if (this._textdecoration)
                control_elem.setElementTextDecoration(this._textdecoration);

            if (this._is_overflow_visible)
                control_elem.setElementOverflow(true);

            // Static usedecorate
            if (this._displaytext)
            {
                if (this._p_usedecorate)
                {
                    control_elem.setElementPointerEvents(this._isEnable() ? "" : "none");
                    control_elem.setElementDecorateText(this._getStringResourceProperty(this._p_text));
                }
                else
                    control_elem.setElementText(this._displaytext);
            }

            if (this._textAnimation)
                control_elem.setElementTextAnimation(this._textAnimation);
            if (this._textAnimationPlayState)
                control_elem.setElementTextAnimationPlayState(this._textAnimationPlayState);
            if (this._textTransform)
                control_elem.setElementTextTransform(this._textTransform);
            if (this._textTransformOrigin)
                control_elem.setElementTextTransformOrigin(this._textTransformOrigin);
            if (this._textTransition)
                control_elem.setElementTextTransition(this._textTransition);

            const fittocontents = this._p_fittocontents;
            if (fittocontents != "none")
            {
                // fittocontents가 width와 both 일때는 적용하지 않음
                if (fittocontents !== "height")
                {
                    control_elem.setElementWordWrap("none");
                }
                this._on_apply_fittocontents();
            }
        }
    };

    _pStatic.on_created_contents = function (win)
    {
        if (this._p_expr)
            this._on_apply_expr(this._p_expr);

        if (this._p_fittocontents != "none")
        {
            this._update_position();
        }

        if (this._env._p_enableaccessibility)
        {
            this._on_created_accessibility_contents(win);
        }
    };

    _pStatic.on_destroy_contents = function ()
    {
        if (this._textpadding)
            this._textpadding = null;
    };

    _pStatic.on_create_contents_command = function ()
    {
        if (this._p_expr)
            this._on_apply_expr(this._p_expr);

        return "";
    };

    _pStatic.on_attach_contents_handle = function (win)
    {
        if (this._p_fittocontents != "none")
        {
            this._update_position();
        }
        this._on_attach_accessibility_contents_handle(win);
    };

    //===============================================================
    // nexacro.Static : Override
    //===============================================================
    _pStatic.on_apply_status = function (status, userstatus)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            if (!this._p_textPadding)
                control_elem.setElementTextPadding(this._getCSSStyleValue("textPadding", status, userstatus));
            if (!this._p_wordWrap)
                control_elem.setElementCSSMapWordWrapInfo(this._getCSSStyleValue("wordWrap", status, userstatus));
            if (!this._p_textOverflow)
                control_elem.setElementCSSMapTextOverflowInfo(this._getCSSStyleValue("textOverflow", status, userstatus));
        }
    };

    _pStatic.on_get_prop_tabstop = function ()
    {
        if (this._env._p_enableaccessibility)
        {
            if (this._p_accessibilityenable && this._p_accessibilityrole == "link")
                return true;
        }
        return false;
    };

    _pStatic._isFocusAcceptable = function ()
    {
        return this._env._p_enableaccessibility;
    };

    _pStatic._on_getFitSize = function ()
    {
        const elem = this.getElement();
        if (elem)
        {
            let total_w = 0;
            let total_h = 0;

            let border = this._getCurrentStyleBorder();
            if (border)
            {
                total_w += border._getBorderWidth();
                total_h += border._getBorderHeight();
            }

            let padding = this._getCurrentStylePadding();
            if (padding)
            {
                total_w += padding.left + padding.right;
                total_h += padding.top + padding.bottom;
            }

            let text;
            if (this._displaytext && this._displaytext !== "")
            {
                // apply_text로 처리된 대상 기준으로 fittocontects가 이루어져야 함
                text = this._displaytext;
            }
            else
                text = this._p_text;
            if (text)
            {
                const font = this._getCurrentStyleInheritValue("font");
                const refer_font = this._getReferenceAbsoluteFont(font); // use to em / rem
                const wordspace = this._getCurrentStyleInheritValue("wordSpacing");
                const letterspace = this._getCurrentStyleInheritValue("letterSpacing");
                const textpadding = this._textpadding || this._getCSSStyleValue("textPadding");

                let wordwrap = "none";
                let width;
                let multiline = false;
                if (text.search("\n") > -1)
                {
                    multiline = true;
                }

                if (this._p_fittocontents == "height")
                {
                    wordwrap = this._p_wordWrap || this._getCSSStyleValue("wordWrap");
                    if (wordwrap && wordwrap != "none")
                        multiline = true;

                    width = this._adjust_width - total_w;
                }

                const b_decoration = this._p_usedecorate;
                const text_size = nexacro._getTextSize(text, font, multiline, width, wordwrap, wordspace, letterspace, b_decoration, undefined, undefined, refer_font);

                total_w += Math.ceil(this._p_textwidth != null ? this._p_textwidth : text_size[0]);
                total_h += Math.ceil(text_size[1]);

                if (textpadding)
                {
                    total_w += textpadding.left + textpadding.right;
                    total_h += textpadding.top + textpadding.bottom;
                }
            }
            return [total_w, total_h];
        }
        return [this._adjust_width, this._adjust_height];
    };

    //===============================================================
    // nexacro.Static : Property
    //===============================================================
    _pStatic.set_usedecorate = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_usedecorate != v)
        {
            this._p_usedecorate = v;
            this.on_apply_usedecorate();
        }
    };

    _pStatic.on_apply_usedecorate = function ()
    {
        this._on_apply_text();
    };

    _pStatic.set_textAnimation = function (v)
    {
        this._p_textAnimation = v;
        if (v)
        {
            if (this._textAnimation == null || this._textAnimation.value != v)
            {
                const animation = nexacro.AnimationObject(v);
                this._textAnimation = animation;
                this.on_apply_textAnimation(animation);
            }
        }
        else
        {
            if (this._textAnimation)
            {
                this._textAnimation = null;
                this.on_apply_textAnimation(null);
            }
        }
    };

    _pStatic.on_apply_textAnimation = nexacro._queueAnimationFrame(function (textAnimation)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextAnimation(textAnimation);
        }
    });

    _pStatic.set_textAnimationPlayState = function (v)
    {
        this._p_textAnimationPlayState = v;
        if (v)
        {
            if (this._textAnimationPlayState == null || this._textAnimationPlayState.value != v)
            {
                const animationPlayState = nexacro.AnimationPlayStateObject(v);
                this._textAnimationPlayState = animationPlayState;
                this.on_apply_textAnimationPlayState(animationPlayState);
            }
        }
        else
        {
            if (this._textAnimationPlayState)
            {
                this._textAnimationPlayState = null;
                this.on_apply_textAnimationPlayState(null);
            }
        }
    };

    _pStatic.on_apply_textAnimationPlayState = function (textAnimationPlayState)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextAnimationPlayState(textAnimationPlayState);
        }
    };

    _pStatic.set_textTransform = function (v)
    {
        this._p_textTransform = v;
        if (v)
        {
            if (this._textTransform == null || this._textTransform.value != v)
            {
                const textTransform = nexacro.TransformObject(v);
                this._textTransform = textTransform;
                this.on_apply_textTransform(textTransform);
            }
        }
        else
        {
            if (this._textTransform)
            {
                this._textTransform = null;
                this.on_apply_textTransform(null);
            }
        }
    };

    _pStatic.on_apply_textTransform = function (textTransform)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextTransform(textTransform);
        }
    };

    _pStatic.set_textTransformOrigin = function (v)
    {
        this._p_textTransformOrigin = v;
        if (v)
        {
            if (this._textTransformOrigin == null || this._textTransformOrigin.value != v)
            {
                var textTransformOrigin = nexacro.TransformOriginObject(v);
                this._textTransformOrigin = textTransformOrigin;
                this.on_apply_textTransformOrigin(textTransformOrigin);
            }
        }
        else
        {
            if (this._textTransformOrigin)
            {
                this._textTransformOrigin = null;
                this.on_apply_textTransformOrigin(null);
            }
        }
    };

    _pStatic.on_apply_textTransformOrigin = function (textTransformOrigin)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextTransformOrigin(textTransformOrigin);
        }
    };

    _pStatic.set_textTransition = function (v)
    {
        this._p_textTransition = v;
        if (v)
        {
            if (this._textTransition == null || this._textTransition.value != v)
            {
                const transition = nexacro.TransitionObject(v);
                this._textTransition = transition;
                this.on_apply_textTransition(transition);
            }
        }
        else
        {
            if (this._textTransition)
            {
                this._textTransition = null;
                this.on_apply_textTransition(null);
            }
        }
    };

    _pStatic.on_apply_textTransition = function (textTransition)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextTransition(textTransition);
        }
    };

    _pStatic.set_textPadding = function (v)
    {
        this._p_textPadding = v;
        if (v)
        {
            if (this._textpadding == null || this._textpadding.value != v)
            {
                const textPadding = nexacro.PaddingObject(v);
                this._textpadding = textPadding;
                this.on_apply_textPadding(textPadding);
            }
        }
        else
        {
            if (this._textpadding)
            {
                this._textpadding = null;
                this.on_apply_textPadding(null);
            }
        }
    };

    _pStatic.on_apply_textPadding = function (textPadding)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextPadding(textPadding || this._getCSSStyleValue("textPadding", this._status, this._userstatus));
        }
    };

    _pStatic.on_apply_text = function (text)
    {
        if (this._p_usedecorate)
        {
            // usedecoreate 속성이 true 이면 displaytext update
            this._displaytext = nexacro._getDisplayTextfromDecorateText(text);

            // label도 update
            if (this._env._p_enableaccessibility)
            {
                this.on_apply_prop_accessibilitylabel();
            }
        }

        const control_elem = this.getElement();
        if (control_elem)
        {
            if (this._p_usedecorate)
            {
                control_elem.setElementDecorateText(text);
            }
            else
            {
                control_elem.setElementText(text);
            }
            control_elem.setElementPointerEvents();
        }
    };

    _pStatic.on_apply_prop_enable = function ()
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementPointerEvents(this._isEnable() ? "" : "none");
        }
    }

    _pStatic.on_apply_textAlign = function (halign)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextAlign(halign);
        }
    };

    _pStatic.on_apply_verticalAlign = function (valign)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementVerticalAlign(valign);
        }
    };

    _pStatic.on_apply_wordWrap = function (wordwrap)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            if (this._p_fittocontents != "none")
            {
                control_elem.setElementWordWrap("none");
                this._update_position();
            }
            else
            {
                control_elem.setElementWordWrap(wordwrap);
            }
        }
    };

    _pStatic.on_apply_textDecoration = function (textDecoration)
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementTextDecoration(textDecoration);
        }
    };

    _pStatic._properties = [{ name: "usedecorate" }, { name: "textPadding" }, { name: "textAnimation" }, { name: "textAnimationPlayState" }, { name: "textTransform" }, { name: "textTransformOrigin" }, { name: "textTransition" }];
    nexacro._defineProperties(_pStatic, _pStatic._properties);

    _pStatic = null;
}

if (!nexacro._TitleBarIconTextControl)
{
    //==============================================================================
    // nexacro._TitleBarIconTextControl
    //==============================================================================
    nexacro._TitleBarIconTextControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro._IconText.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pTitleBarIconTextControl = nexacro._createPrototype(nexacro._IconText, nexacro._TitleBarIconTextControl);
    nexacro._TitleBarIconTextControl.prototype = _pTitleBarIconTextControl;
    _pTitleBarIconTextControl._type_name = "TitleBarIconTextControl";

    /* status */
    _pTitleBarIconTextControl._is_subcontrol = true;
    _pTitleBarIconTextControl._is_fiticonsize = true;

    _pTitleBarIconTextControl = null;
}