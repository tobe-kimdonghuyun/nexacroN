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

if (!nexacro.XAgent)
{
    "use strict";

    //==============================================================================
    // nexacro.XAgentEventInfo
    //==============================================================================
    nexacro.XAgentEventInfo = function (obj, eventid, statusmessage, reason, param, modulename, modulefunc, uid, extraData)
    {
        this.obj = obj;
        this.eventid = eventid;
        this.statusmessage = statusmessage;
        this.reason = reason;
        this.param = param;
        this.modulename = modulename;
        this.modulefunc = modulefunc;
        this.uid = uid;
        this.extraData = extraData;
    };

    var _pXAgentEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.XAgentEventInfo);
    nexacro.XAgentEventInfo.prototype = _pXAgentEventInfo;
    _pXAgentEventInfo._type_name = "XAgentEventInfo";

    delete _pXAgentEventInfo;
    _pXAgentEventInfo = null;


    //==============================================================================
    // nexacro.XAgentErrorEventInfo
    //==============================================================================
    nexacro.XAgentErrorEventInfo = function (obj, eventid, errorcode, errormsg, data, uid, extraData)
    {
        this.obj = obj;
        this.eventid = eventid;
        this.errormsg = errormsg;
        this.errorcode = errorcode;
        this.data = data;
        this.uid = uid;
        this.extraData = extraData;
    };

    var _pXAgentErrorEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.XAgentErrorEventInfo);
    nexacro.XAgentErrorEventInfo.prototype = _pXAgentErrorEventInfo;
    _pXAgentErrorEventInfo._type_name = "XAgentErrorEventInfo";

    delete _pXAgentErrorEventInfo;
    _pXAgentErrorEventInfo = null;


    //==============================================================================
    // nexacro.XAgent
    //==============================================================================
    nexacro.XAgent = function (id, parent) 
    {
        nexacro._EventSinkObject.call(this, id, parent);
    };

    var _pXAgent = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.XAgent);
    nexacro.XAgent.prototype = _pXAgent;
    _pXAgent._type_name = "XAgent";

    /* default properties */
    _pXAgent._p_port = 49020;                      // Port - fix [ws,wss] [49020, 49031]
    _pXAgent._p_protocol = "ws";                   // Protocol name
    _pXAgent._p_addport = 5;                       // port 에서 addport 만큼 port check (Default 5)
    _pXAgent._p_project = "";                      // project 
    _pXAgent._p_license = "";                      // license
    _pXAgent._p_updateurl = "";                    // update url
    _pXAgent._p_adminapiurl = "";                  // admin api url

    /* internal variable */
    _pXAgent._isConnect = false;                   // XAgnet Server connect check
    _pXAgent._host = "127.0.0.1";                  // host - fix (Local Server)
    _pXAgent._basePath = "XAgent";                 // BasePath - fix "XAgent
    _pXAgent._protocolIdx = 0;                     // 0, 1	(Default 0 - ws, 1- wss)  XAgent Protocol index
    _pXAgent._basePort = [49020, 49031];		   // BasePort (start port, ws, wss) 
    _pXAgent._currentPort = 49020;                 // connect port
    _pXAgent._currentDomain = "";                  // current domain for license check

    _pXAgent._socket = null;
    _pXAgent._socket_data = [];
    _pXAgent._svcId = "";
    _pXAgent._module = null;
    _pXAgent._modulefn = null;
    _pXAgent._param = {};


    ////===============================================================
    //// nexacro.XAgent : callback
    ////===============================================================
    //_pXAgent._callbackMap = {}; // callback M

    //// callbackId와 callback 함수를 _callbackMap에 저장하는 함수
    //_pXAgent._addCallback = function (callbackId, callback)
    //{
    //    this._callbackMap[callbackId] = callback;
    //}

    //// callbackId에 해당하는 callback 함수를 _callbackMap에서 삭제하는 함수
    //_pXAgent._getCallback = function (callbackId)
    //{
    //    var callback = this._callbackMap[callbackId];
    //    if (callback)
    //    {
    //        delete this._callbackMap[callbackId];
    //    }
    //    return callback;
    //}

    _pXAgent._event_list = {
        "onsuccess": 1, "onerror": 1
    };

    //===============================================================
    // nexacro.XAgent : Destroy
    //===============================================================
    _pXAgent.destroy = function () 
    {
        if (this._socket)
        {
            this.disconnect();
        }

        this._socket_data = null;
        this._socket = null;

        this._svcId = null;
        this._module = null;
        this._modulefn = null;
        this._param = null;

        if (this._p_parent)
        {
            this._p_parent.removeChild(this.id);
        }

        nexacro._EventSinkObject.prototype.destroy.call(this);
    };

    /* XAgent Inner Const */
    // XAgent service's default error code
    _pXAgent._default_service_errorcode = {
        "connect": -101,
        "update-module": -201,
        "update-modules": -301,
        "update-module-check": -401,
        "installed": -501,
        "status": -601,
        "version": -701,
        "configure": -801,
        "exception": -901,
        "execute": -1001
    };

    // XAgent server error code => nexacro error tqable
    _pXAgent._errortable = {
        "-101": "object_xagent_fail_connect",
        "-102": "object_xagent_fail_disconnect",
        "-103": "object_xagent_fail_communication_retry",
        "-104": "object_xagent_fail_connection_reinstall",
        "-105": "object_xagent_fail_invalid_service_format",
        "-106": "object_xagent_fail_socket_unconnect",
        "-107": "object_xagent_fail_connection_retry",
        "-108": "object_xagent_fail_port_retry",
        "-201": "object_xagent_fail_module_update",
        "-202": "object_xagent_error_invalid_url",
        "-203": "object_xagent_fail_update_version_check",
        "-204": "object_xagent_fail_update_download",
        "-205": "object_xagent_fail_delete_directory",
        "-206": "object_xagent_fail_decompression",
        "-207": "object_xagent_fail_delete_temp_directory",
        "-301": "object_xagent_fail_modules_update",
        "-303": "object_xagent_fail_found_json_file",
        "-304": "object_xagent_fail_module_download",
        "-401": "object_xagent_fail_update_module_check",
        "-501": "object_xagent_fail_installed",
        "-601": "object_xagent_fail_check_status",
        "-701": "object_xagent_fail_check_version",
        "-704": "object_xagent_fail_found_server",
        "-705": "object_xagent_fail_found_modules",
        "-801": "object_xagent_fail_configure",
        "-804": "object_xagent_fail_found_project",
        "-805": "object_xagent_fail_found_license",
        "-806": "object_xagent_fail_license",
        "-807": "object_xagent_fail_found_updateurl",
        "-1001": "object_xagent_fail_execute",
        "-1002": "object_xagent_error_unknown",
        "-1003": "object_xagent_error_argument",
        "-1004": "object_xagent_fail_found_module_execute",
        "-1005": "object_xagent_fail_found_func_execute",
        "-1006": "object_xagent_fail_found_param",
        "-1007": "object_xagent_error_json_parsing"
    };

    //===============================================================
    // nexacro.XAgent : Properties
    //===============================================================
    _pXAgent.set_port = function (v) 
    {
        if (v === undefined || v === null) return;
        v = nexacro._toInt(v);

        if (v != this._p_port)
        {
            this._currentPort = this._p_port = v;
        }
    };

    _pXAgent.set_protocol = function (v)
    {
        if (v === "undefined" || v === null || v === "")
            return true;

        var WEBSOCKET_PROTOCOL = ["ws", "wss"];
        if (WEBSOCKET_PROTOCOL.indexOf(v) == -1)
        {
            return false;
        }

        if (v != this._p_protocol)
        {
            this._p_protocol = v;
        }
    };

    _pXAgent.set_addport = function (v)
    {
        v = nexacro._toInt(v);

        if (v != this._p_addport)
        {
            this._p_addport = v;
        }
    };

    _pXAgent.set_project = function (v)
    {
        if (v === "undefined" || v === null || v === "")
            return true;

        if (v != this._p_project)
        {
            this._p_project = v;
        }
    };

    _pXAgent.set_license = function (v)
    {
        if (v === "undefined" || v === null || v === "")
            return true;

        if (v != this._p_license)
        {
            this._p_license = v;
        }
    };

    _pXAgent.set_updateurl = function (v)
    {
        // validation
        if (v === "undefined" || v === null || v === "")
            return true;

        if (v != this._p_updateurl)
        {
            this._p_updateurl = v;
        }
    };

    _pXAgent.set_adminapiurl = function (v)
    {
        // validation
        if (v === "undefined" || v === null || v === "")
            return true;

        if (v != this._p_adminapiurl)
        {
            this._p_adminapiurl = v;
        }
    }

    //===============================================================
    // nexacro.XAgent : Methods
    //===============================================================
    _pXAgent.connect = function (strProject, strLicense, strUpdateUrl, strAdminApiUrl)
    {
        // isConnect check
        if (this._isConnect)
        {
            this._on_success("object_xagent_success_connect", "connect", null, "XAgent", "connect", null);
            return;
        }

        if (!strProject)
        {
            strProject = this._p_project;
        }

        if (!strLicense)
        {
            strLicense = this._p_license;
        }

        if (!strUpdateUrl)
        {
            strUpdateUrl = this._p_updateurl;
        }

        if (!strAdminApiUrl)
        {
            strAdminApiUrl = this._p_adminapiurl;
        }

        var WEBSOCKET_PROTOCOL = ["ws", "wss"];
        if (WEBSOCKET_PROTOCOL.indexOf(this._p_protocol) == -1)
        {
            var errorcode = this._getErrorCode(serviceId);
            this._on_error(errorcode, null, null, null);
            return;
        }
        else
        {
            var index = this._p_protocol == "wss" ? 1 : 0;
            this._protocolIdx = index;

            if (!this._p_port)
            {
                this._p_port = this._basePort[index];
            }

            this._currentPort = this._p_port;

            this._currentDomain = this._getCurrentDomain();

            this._param = {
                "project": strProject,
                "license": strLicense,
                "updateUrl": strUpdateUrl,
                "adminApiUrl": strAdminApiUrl,
                "domain": this._currentDomain
            };

            this._connectXAgent();
        }
    };

    _pXAgent._connectXAgent = function ()
    {
        var socket = this._socket = new WebSocket(this._p_protocol + "://" + this._host + ":" + this._currentPort + "/" + this._basePath + "?tm=" + new Date().getTime());

        socket.onopen = this._bindOpenHandler(this);
        socket.onmessage = this._bindMessageHandler(this);
        socket.onerror = this._bindErrorHandler(this);
        socket.onclose = this._bindCloseHandler(this);
    };

    _pXAgent.disconnect = function () 
    {
        if (this._socket)
        {
            this._socket.onopen = null;
            this._socket.onmessage = null;
            this._socket.onerror = null;
            this._socket.onclose = null;

            this._socket.close();
            this._socket = null;

            this._isConnect = false;
            this._svcId = null;
            this._module = null;
            this._modulefn = null;
            this._param = null;
            this._socket_data = [];

            this._on_success("object_xagent_success_disconnect", "disconnect", null, null, null, null);
        }
        else
        {
            this._on_error(-102, null, null);
        }
    };

    _pXAgent.version = function (strType)
    {
        var serviceId = "version";

        if (strType === undefined || strType === null || strType === "")
        {
            strType = "all";
        }

        if (strType !== "server" && strType !== "modules" && strType !== "all")
        {
            var errorcode = this._getErrorCode(serviceId);
            this._on_error(errorcode, null, null, null);
            return;
        }

        if (this._isConnect)
        {
            this._param = {
                "type": strType
            };

            this._callService(serviceId, "XAgent", "version", this._param);
        }
        else
        {
            var errorcode = this._getErrorCode(serviceId);
            this._on_error(errorcode, null, null, null);
        }
    };

    _pXAgent.installed = function (strRegistyPath, strResgistryKey)
    {
        var serviceId = "installed";

        if (strRegistyPath === undefined || strRegistyPath === null || strRegistyPath === "" ||
            strResgistryKey === undefined || strResgistryKey === null || strResgistryKey === "")
        {
            var errorcode = this._getErrorCode(serviceId);
            this._on_error(errorcode, null, null, null);
            return;
        }

        if (this._isConnect)
        {
            this._param = {
                "registry-path": strRegistyPath,
                "registry-key": strResgistryKey
            };
            this._callService(serviceId, "XAgent", "installed", this._param);
        }
        else
        {
            var errorcode = this._getErrorCode(serviceId);
            this._on_error(errorcode, null, null, null);
        }
    };

    _pXAgent.configure = function (strProject, strLicense, strUpdateUrl, strAdminApiUrl)
    {
        var serviceId = "configure";

        if (strProject === undefined || strProject === null || strProject === "" ||
            strLicense === undefined || strLicense === null || strLicense === "" ||
            strUpdateUrl === undefined || strUpdateUrl === null || strUpdateUrl === "")
        {
            var errorcode = this._getErrorCode(serviceId);
            this._on_error(errorcode, null, null, null);
            return;
        }

        if (strAdminApiUrl === undefined || strAdminApiUrl === null || strAdminApiUrl === "")
        {
            strAdminApiUrl = "";
        }

        if (this._isConnect)
        {
            this._param = {
                "project": strProject,
                "license": strLicense,
                "updateurl": strUpdateUrl,
                "adminapiurl": strAdminApiUrl
            };
            this._callService(serviceId, "XAgent", "configure", this._param);
        }
        else
        {
            var errorcode = this._getErrorCode(serviceId);
            this._on_error(errorcode, null, null, null);
        }
    };

    _pXAgent.updateModule = function (strName, strVersion, strFile, strProject, bForceInstall)
    {
        var serviceId = "update-module";

        if (strName === undefined || strName === null || strName === "" ||
            strVersion === undefined || strVersion === null || strVersion === "" ||
            strFile === undefined || strFile === null || strFile === "" ||
            strProject === undefined || strProject === null || strProject === "")
        {
            var errorcode = this._getErrorCode(serviceId);
            this._on_error(errorcode, null, null, null);
            return;
        }

        if (bForceInstall === undefined || bForceInstall === null || bForceInstall === "")
        {
            bForceInstall = false;
        }

        if (this._isConnect)
        {
            this._param = {
                "name": strName,
                "version": strVersion,
                "file": strFile,
                "project": strProject,
                "force-install": bForceInstall
            };
            this._callService(serviceId, "XAgent", "update-module", this._param);
        }
        else
        {
            var errorcode = this._getErrorCode(serviceId);
            this._on_error(errorcode, null, null, null);
        }
    };

    _pXAgent.updateModules = function (strProject)
    {
        var serviceId = "update-modules";

        if (strProject === undefined || strProject === null || strProject === "")
        {
            var errorcode = this._getErrorCode(serviceId);
            this._on_error(errorcode, null, null, null);
            return;
        }

        if (this._isConnect)
        {
            this._param = {
                "project": strProject
            };
            this._callService(serviceId, "XAgent", "update-modules", this._param);
        }
        else
        {
            var errorcode = this._getErrorCode(serviceId);
            this._on_error(errorcode, null, null, null);
        }
    };

    _pXAgent.updateModuleCheck = function ()
    {
        var serviceId = "update-module-check";

        if (this._isConnect)
        {
            this._callService(serviceId, "XAgent", "update-module-check", {});
        }
        else
        {
            var errorcode = this._getErrorCode(serviceId);
            this._on_error(errorcode, null, null, null);
        }
    };

    _pXAgent.status = function (strType)
    {
        var serviceId = "status";

        if (strType === undefined || strType === null || strType === "")
        {
            strType = "all";
        }

        if (strType !== "server" && strType !== "process" && strType !== "all")
        {
            var errorcode = this._getErrorCode(serviceId);
            this._on_error(errorcode, null, null, null);
            return;
        }

        if (this._isConnect)
        {
            this._param = {
                "type": strType
            };

            this._callService(serviceId, "XAgent", "status", this._param);
        }
        else
        {
            var errorcode = this._getErrorCode(serviceId);
            this._on_error(errorcode, null, null, null);
        }
    };

    _pXAgent.execute = function (strModule, strFunc, objParam, objExtraData)
    {
        var serviceId = "execute";

        if (strModule === undefined || strModule === null || strModule === "" ||
            strFunc === undefined || strFunc === null || strFunc === "")
        {
            var errorcode = this._getErrorCode(serviceId);
            this._on_error(errorcode, null, null, objExtraData);
            return { uid: null, extra: objExtraData, errorcode: errorcode };
        }

        if (this._isConnect)
        {
            this._param = objParam || {};

            var uid = this._callService(serviceId, strModule, strFunc, this._param, objExtraData);
            return { uid: uid, extra: objExtraData };
        }
        else
        {
            var errorcode = this._getErrorCode(serviceId);
            this._on_error(errorcode, null, null, objExtraData);
            return { uid: null, extra: objExtraData, errorcode: errorcode };
        }
    };

    //===============================================================
    // nexacro.XAgent : Event Handlers
    //===============================================================
    _pXAgent.on_fire_onsuccess = function (statusmessage, reason, param, modulename, modulefunc, uid, extraData)
    {
        if (this.onsuccess && this.onsuccess._has_handlers)
        {
            var evt = new nexacro.XAgentEventInfo(this, "onsuccess", statusmessage, reason, param, modulename, modulefunc, uid, extraData);
            return this.onsuccess._fireEvent(this, evt);
        }
        return true;
    };

    _pXAgent.on_fire_onerror = function (code, statusmessage, data, uid, extraData)
    {
        if (this.onerror && this.onerror._has_handlers)
        {
            var evt = new nexacro.XAgentErrorEventInfo(this, "onerror", code, statusmessage, data, uid, extraData);
            return this.onerror._fireEvent(this, evt);
        }
    };

    _pXAgent._on_success = function (statusmessage, reason, param, modulename, modulefunc, uid, extraData)
    {
        var errormsg = nexacro._getErrorMessge(statusmessage);
        this.on_fire_onsuccess(errormsg ? errormsg : statusmessage, reason, param, modulename, modulefunc, uid, extraData);
    };

    _pXAgent._on_error = function (errorcode, data, uid, extraData)
    {
        var errormsg = this._getErrorMessage(errorcode);
        this.on_fire_onerror(errorcode, errormsg, data, uid, extraData);
    };

    //===============================================================
    // nexacro.XAgent : Util Function
    //===============================================================
    _pXAgent._callService = function (strServiceId, strModule, strModuleFunc, objParam, objExtraData) 
    {
        if (this._isConnect == false && strServiceId != "connect")
        {
            this._on_error(-106, null, null, extraData);
            return null;
        }

        var serviceId = strServiceId;
        var module = strModule;
        var modulefn = strModuleFunc;

        var uid = this._setUUID(serviceId);
        var param = objParam || {};
        var extraData = objExtraData || null;

        var data = {};

        switch (serviceId)
        {
            case "connect":
            case "installed":
            case "version":
            case "update-module":
            case "update-module-check":
            case "update-modules":
            case "status":
            case "configure":
            case "execute":
                data[serviceId] = { "module": module, "func": modulefn, "uid": uid, "param": param, "extraData": extraData };
                break;
            default:
                data["request"] = { "module": module, "func": modulefn, "uid": uid, "param": param, "extraData": extraData };
                break;
        }

        this._module = module;
        this._svcId = serviceId;
        this._modulefn = modulefn;
        this._param = param;

        this._socket.send(JSON.stringify(data));

        return uid;
    };

    _pXAgent._getErrorCode = function (serviceId)
    {
        var code = this._default_service_errorcode[serviceId];
        if (nexacro._isNull(code))
        {
            return -1002; // object_xagent_error_unknown
        }
        else
        {
            return code;
        }
    };

    _pXAgent._getErrorMessage = function (errorcode)
    {
        var message = this._errortable[errorcode];
        if (nexacro._isNull(message))
        {
            return "";
        }
        else
        {
            return nexacro._getErrorMessge(message);
        }
    };

    _pXAgent._checkPort = function ()
    {
        var maxPort = this._p_port + this._p_addport;

        if (this._currentPort >= maxPort)
        {
            this._currentPort = this._p_port;
            return false;
        }
        else
        {
            this._currentPort++;
            return true;
        }
    };

    _pXAgent._createUUID = function () 
    {
        var curTime = new Date().getTime();
        var uuidTemplate = "xx_yx";

        var name = curTime + "_" + uuidTemplate.replace(/[xy]/g, function (c)
        {
            var randomValue = (nexacro._random() * 16) | 0;
            var value = c == "x" ? randomValue : (randomValue & 0x3) | 0x8;
            return value.toString(16);
        });
        return name;
    };

    _pXAgent._setUUID = function (serviceId) 
    {
        var uid = this._createUUID();
        this._socket_data.push({ "uid": uid, "svc": serviceId });
        return uid;
    };


    _pXAgent._getUUID = function (uid) 
    {
        var data = this._socket_data;
        for (var i = 0; i < data.length; i++)
        {
            if (data[i].uid == uid)
            {
                var serviceId = data[i].svc;
                return { "svc": serviceId };
            }
        }
        return {};
    };

    _pXAgent._bindOpenHandler = function (pthis)
    {
        return function (e)
        {
            pthis._isConnect = true;

            if (pthis._module && pthis._module.length > 0)
            {
                pthis._callService(pthis._svcId, pthis._module, pthis._modulefn, pthis._param);
            }
            else
            {
                pthis._callService("connect", "XAgent", "connect", pthis._param);
            }
        };
    };

    _pXAgent._bindMessageHandler = function (pthis)
    {
        var dataBuffer = "";

        return function (e)
        {
            if (e && e.data)
            {
                dataBuffer += e.data;
                try
                {
                    var _data = JSON.parse(dataBuffer);

                    dataBuffer = "";

                    if (_data && _data.response)
                    {
                        var _resobj = _data.response;
                        var _command = Object.keys(_resobj)[0];
                        var _jsondata = {}, serviceid = "", result = null, param = null, modulename = "", uid = "", extraData = null;

                        if (_command)
                        {
                            _jsondata = _resobj[_command];
                        }

                        serviceid = pthis._getUUID(_jsondata.uid).svc;

                        extraData = _jsondata.extraData;

                        result = _jsondata.result;
                        param = _jsondata.param;
                        modulename = _jsondata.module;
                        modulefunc = _jsondata.func;
                        uid = _jsondata.uid;

                        switch (_command)
                        {
                            case "connect":
                                if (param)
                                {
                                    pthis._isConnect = true;
                                    pthis._on_success("object_xagent_success_connect", "connect", param, modulename, modulefunc, uid, extraData);
                                }
                                else
                                {
                                    pthis._on_error(result[0], e.data, uid, extraData);
                                }
                                break;
                            case "installed":
                            case "version":
                            case "update-module":
                            case "update-module-check":
                            case "update-modules":
                            case "status":
                            case "configure":
                            case "execute":
                                if (result[0] == 0)
                                {
                                    pthis._on_success(result[1], _command, param, modulename, modulefunc, uid, extraData);
                                }
                                else
                                {
                                    pthis._on_error(result[0], e.data, uid, extraData);
                                }
                                break;
                            case "event":
                                var eventid = _jsondata.eventid;
                                var eventdata = _jsondata.eventdata;
                                var param = [eventid, eventdata];
                                if (result[0] == 0)
                                {
                                    pthis._on_success("", _command, param, modulename, modulefunc, uid, extraData);
                                }
                                else
                                {
                                    pthis._on_error("", param, uid, extraData);
                                }
                                break;
                            default:
                                pthis._on_error(-105, e.data, uid, extraData);
                                break;
                        }
                    }
                }
                catch (e)
                {
                    return;
                }
            }
        };
    };

    _pXAgent._bindErrorHandler = function (pthis)
    {
        return function (e)
        {
            pthis._on_error(-103, e, null);
        };
    };

    _pXAgent._bindCloseHandler = function (pthis)
    {
        return function (e)
        {
            if (pthis._isConnect)
            {
                pthis._on_error(-107, null, null);
                pthis._isConnect = false;
            }
            else
            {
                if (!pthis._checkPort())
                {
                    pthis._on_error(-104, null, null);
                }
                else
                {
                    pthis._on_error(-108, null, null);
                    pthis._socket = null;
                    pthis._connectXAgent();
                }
            }
        }
    };

    _pXAgent._getStatus = function ()
    {
        if (!this._socket)
        {
            return "CLOSED";
        }

        switch (this._socket.readyState)
        {
            case 1:
                return "OPEN";
            case 2:
                return "CLOSE";
            case 3:
                return "CLOSED";
            default:
                return "CONNECTING";
        }
    };

    _pXAgent._isValidIpAddress = function (domain)
    {
        //IPv4
        if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(domain))
        {
            return false;
        }

        var parts = domain.split('.');
        return parts.every(function (part)
        {
            var num = parseInt(part, 10);
            return num >= 0 && num <= 255;
        });
    };


    _pXAgent._getCurrentDomain = function ()
    {
        var domain;
        // Runtime, Hybrid 여부와 관계없이 nexacro._project_url 사용
        var projectUrl = nexacro._project_url;

        // URL에서 도메인 추출
        var matches = projectUrl.match(/^https?:\/\/([^:\/?#]+)/i);
        domain = matches && matches[1];

        if (!domain)
        {
            domain = "localhost";
            return domain;
        }

        // IP 주소 체크
        if (this._isValidIpAddress(domain))
        {
            return domain;
        }

        // localhost 체크
        if (domain === "localhost")
        {
            return domain;
        }

        return domain;
    };

    _pXAgent._properties = [{ name: "port" }, { name: "protocol" }, { name: "addport" }, { name: "project" }, { name: "license" }, { name: "updateurl" }, { name: "adminapiurl" }];
    nexacro._defineProperties(_pXAgent, _pXAgent._properties);

    delete _pXAgent;
}
