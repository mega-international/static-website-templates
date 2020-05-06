var bGecko = !!window.controllers;
var bIE = window.document.all && !window.opera;
var bDesktop;
(function () {
  try {
    var nativeActiveXObject = window.ActiveXObject;
        
    var oRoot = external.MegaRoot;
    if (oRoot !== null && oRoot !== undefined) {
      bDesktop = true;
    } else {
      bDesktop = false;
    }
  } catch (e) {
    bDesktop = false;
  }
  if (bDesktop) {
    
    function MegaDesktopXMLHttpRequest(proxy) {
      this._oRoot = external.MegaRoot;
      this._proxy = proxy;
      this._oDesktopServerMacro = this._oRoot.CurrentEnvironment.GetMacro("~RlohekGcBXc0[DesktopServer]");
      this._oDesktopServerMacro.setRoot(this._oRoot);
      this._headers = null;
      this._listeners = [];
    }
    
    MegaDesktopXMLHttpRequest.prototype.open = function(sMethod, sUrl, bAsync, sUser, sPassword) {
      this._headers = [];
      this._oDesktopServerMacro.setUrl(sUrl.replace(/%2B/g, '+'));
      this._oDesktopServerMacro.setAsync(bAsync);
    };
    
    MegaDesktopXMLHttpRequest.prototype.send = function(vData) {
      //alert( 'send: ' + vData );
      var bAsync = this._oDesktopServerMacro.isAsync();
      if (vData && vData.nodeType) {
        vData = window.XMLSerializer ? new window.XMLSerializer().serializeToString(vData) : vData.xml;
        if (!this._headers["Content-Type"]) {
          this.setRequestHeader("Content-Type", "application/xml");
        }
      }
      this._oDesktopServerMacro.setPOSTDOMString(vData);
      var responseObject = this._oDesktopServerMacro.serve();
      if (bAsync) {
        var self = this;
        var delay = 1;
        var timer = setInterval(function() {
          self.getResult(self, responseObject, bAsync, timer);
        }, delay);
      } else {
        this.getResult(this, responseObject, bAsync);
      }
    };
    
    MegaDesktopXMLHttpRequest.prototype.getResult = function(self, responseObject, bAsync, timer) {
      if (typeof(responseObject) === "string") {
        alert(responseObject);
      } else {
        var elapsed;
        var timeout = false;
        var bCompleted = false;
        if (responseObject !== undefined) {
        if (!bAsync) {
          setTimeout(function() {
            timeout = true;
          }, 90000);
          while (!timeout && !bCompleted) {
            bCompleted = responseObject.IsCompleted(elapsed);
          }
        } else {
          bCompleted = responseObject.IsCompleted(elapsed);
				}
        }
        if (bCompleted || responseObject === undefined ) {        
          if (bAsync) {
            clearInterval(timer);
            timer = null;
          }
          
          self._proxy.responseXML = "";
          self._proxy.responseData = "";
          self._proxy.readyState = MegaXMLHttpRequestProxy.DONE;      
          
          var cacheStatus;
          var cacheAccess;
          var weight;
          var timeGeneration;
          var heartBeatTimeout;
          var type;
          // out arguments don't work in JS, we will only have result
          if (responseObject !== undefined) {
          var result = responseObject.GetResult(cacheStatus, cacheAccess, weight, timeGeneration, heartBeatTimeout, type);
            if (result.length == 0) {
              self._proxy.responseText = '{"errCode": "unknown", "message": "Generator delivered an empty result"}';
              self.setRequestHeader("Content-Type", "application/json");
              self._proxy.status = 500;
            } else {
          self._proxy.responseText = result;
          self._proxy.status = 200;
          if (result.indexOf('<?xml version="1.0"?>') > -1) {
            var doc = new ActiveXObject("Microsoft.XMLDOM");
            doc.async = "false";
            doc.loadXML(self._proxy.responseText);
            self.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
            self._proxy.responseXML = doc;
          }
            }
          } else {
            self._proxy.responseText = '{"errCode": "unknown", "message": "No responseObject returned by Generate invoke"}';
            self.setRequestHeader("Content-Type", "application/json");
            self._proxy.status = 500;
          }
          
          var oEvent = {
            'type'            : "readystatechange",
            'target'          : this,
            'currentTarget'   : this,
            'eventPhase'      : 2,
            'bubbles'         : true,
            'cancelable'      : false,
            'timeStamp'       : new Date() + 0,
            'stopPropagation' : function() {
            },
            'preventDefault'  : function() {
            },
            'initEvent'       : function() {
            }
          };
          if (self._proxy.onreadystatechange !== null) {
            (self._proxy.onreadystatechange.handleEvent || self._proxy.onreadystatechange).apply(self._proxy, [oEvent]);
          }
          for (var nIndex = 0, oListener; oListener = self._listeners[nIndex]; nIndex++) {
            if (oListener[0] == oEvent.type && !oListener[2]) {
              (oListener[1].handleEvent || oListener[1]).apply(self._proxy, [oEvent]);
            }
          }
        }
      }
    };
    
    MegaDesktopXMLHttpRequest.prototype.abort = function() {
    };
    
    MegaDesktopXMLHttpRequest.prototype.getAllResponseHeaders = function() {
      var s = "";
      for (var i in this._headers) {
        s += "\n" + i + ": " + this._headers[i];
      }
      if (s.length > 0) {
        s = s.substring(1);
      }
      return s;
    };
    
    MegaDesktopXMLHttpRequest.prototype.getResponseHeader = function(sName) {
      return this._headers[sName];
    };
    
    MegaDesktopXMLHttpRequest.prototype.setRequestHeader = function(sName, sValue) {
      this._headers[sName] = sValue;
      this._oDesktopServerMacro.setRequestHeader(sName, sValue);
    };
    
    MegaDesktopXMLHttpRequest.prototype.overrideMimeType = function() {
    };
    
    MegaDesktopXMLHttpRequest.prototype.addEventListener = function(sName, fHandler, bUseCapture) {
      for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++) {
        if (oListener[0] == sName && oListener[1] == fHandler && oListener[2] == bUseCapture) {
          return;
        }
      }
      this._listeners.push([sName, fHandler, bUseCapture]);
    };
    
    MegaDesktopXMLHttpRequest.prototype.removeEventListener = function(sName, fHandler, bUseCapture) {
      for (var nIndex = 0, oListener; oListener = this._listeners[nIndex]; nIndex++) {
        if (oListener[0] == sName && oListener[1] == fHandler && oListener[2] == bUseCapture) {
          break;
        }
      }
      if (oListener) {
        this._listeners.splice(nIndex, 1);
      }
    };
    
    MegaDesktopXMLHttpRequest.prototype.toString = function() {
      return '[' + "MegaDesktopXMLHttpRequest" + ']';
    };
    
    if (typeof window.XMLHttpRequest == "undefined") {
      window.XMLHttpRequest = function () {
        var type = ['MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
        for (var i = 0; i < type.length; ++i) {
          try {
            return new ActiveXObject(type[i]);
          } catch(e) {
          }
        }
      };
    }
    
    function getNativeActiveXHttpRequest() {
      var type = ['MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
      for (var i = 0; i < type.length; ++i) {
        try {
          return new nativeActiveXObject(type[i]);
        } catch(e) {
        }
      }
    }
    
    var oXMLHttpRequest = window.XMLHttpRequest;
    
    function MegaXMLHttpRequestProxy(cfg) {
      cfg = cfg || {};
      if (cfg.nativeXMLHttpRequest) {
        this._nativeXMLHttpRequest = cfg.nativeXMLHttpRequest;
      } else {
        this._nativeXMLHttpRequest = new oXMLHttpRequest();
      }
      if (bDesktop) {
        this._desktopXMLHttpRequest = new MegaDesktopXMLHttpRequest(this);
      } else {
        this._desktopXMLHttpRequest = null;
      }
      this.bIsUrlLocal = true;
    }
    
    MegaXMLHttpRequestProxy.UNSENT = 0;
    MegaXMLHttpRequestProxy.OPENED = 1;
    MegaXMLHttpRequestProxy.HEADERS_RECEIVED = 2;
    MegaXMLHttpRequestProxy.LOADING = 3;
    MegaXMLHttpRequestProxy.DONE = 4;
    MegaXMLHttpRequestProxy.prototype.readyState = MegaXMLHttpRequestProxy.UNSENT;
    MegaXMLHttpRequestProxy.prototype.responseText = '';
    MegaXMLHttpRequestProxy.prototype.responseXML = '';
    MegaXMLHttpRequestProxy.prototype.responseData = '';
    MegaXMLHttpRequestProxy.prototype.status = 0;
    MegaXMLHttpRequestProxy.prototype.statusText = '';
    MegaXMLHttpRequestProxy.prototype.onreadystatechange = null;
    
    MegaXMLHttpRequestProxy.prototype._onReadyStateChangeMegaXMLHttpRequestProxyHandler = function() {
      this.readyState = this._nativeXMLHttpRequest.readyState;
      try {
        this.responseText = this._nativeXMLHttpRequest.responseText;
      } catch(e) {
      }
      this.responseXML = this._nativeXMLHttpRequest.responseXML;
      this.responseData = this._nativeXMLHttpRequest.responseData;
      try {
        this.status = this._nativeXMLHttpRequest.status;
      } catch(e) {
      }
      try {
        this.statusText = this._nativeXMLHttpRequest.statusText;
      } catch(e) {
      }
      if (this.onreadystatechange !== null && this.onreadystatechange !== undefined) {
        this.onreadystatechange();
      }
    };
    
    function isFileProtocol(sUrl) {
      return 0 == sUrl.indexOf( 'file:/' );
    }
    
    MegaXMLHttpRequestProxy.prototype.open = function(sMethod, sUrl, bAsync, sUser, sPassword) {
      
      this.bIsUrlLocal = this.IsUrlLocal(sUrl);
      if (!bDesktop || !this.bIsUrlLocal) {
        
        if (isFileProtocol(sUrl)) {
          this._nativeXMLHttpRequest = getNativeActiveXHttpRequest();
        }      
        
        this._bAsync = bAsync;
        this._nativeXMLHttpRequest.open(sMethod, sUrl, bAsync, sUser, sPassword);
        if (bAsync) {
          var self = this;
          this._nativeXMLHttpRequest.onreadystatechange = function() {
            self._onReadyStateChangeMegaXMLHttpRequestProxyHandler();
          };
        }
      } else {
        //alert('this._desktopXMLHttpRequest.open ( ' + sMethod +', '+ sUrl +', '+ bAsync +', '+ sUser +', '+ sPassword + ' )')
        this._desktopXMLHttpRequest.open(sMethod, sUrl, bAsync, sUser, sPassword);
        this.readyState = MegaXMLHttpRequestProxy.OPENED;
      }
    };
    
    MegaXMLHttpRequestProxy.prototype.IsUrlLocal = function(sUrl) {
      return (sUrl.indexOf("service.aspx") > -1) || sUrl.indexOf("winweb.aspx") > -1;
    };
    
    MegaXMLHttpRequestProxy.prototype.send = function(vData) {
      if (!bDesktop || !this.bIsUrlLocal) {
        this._nativeXMLHttpRequest.send(vData);
        if (!this._bAsync) {
          this._onReadyStateChangeMegaXMLHttpRequestProxyHandler();
        }
      } else {
        //alert('this._desktopXMLHttpRequest.send ( ' + vData + ' )')
        this._desktopXMLHttpRequest.send(vData);
      }
    };
    
    MegaXMLHttpRequestProxy.prototype.abort = function() {
      if (!bDesktop || !this.bIsUrlLocal) {
        this._nativeXMLHttpRequest.abort();
      } else {
        this._desktopXMLHttpRequest.abort();
      }
    };
    
    MegaXMLHttpRequestProxy.prototype.getAllResponseHeaders = function() {
      if (!bDesktop || !this.bIsUrlLocal) {
        return this._nativeXMLHttpRequest.getAllResponseHeaders();
      } else {
        return this._desktopXMLHttpRequest.getAllResponseHeaders();
      }
    };
    
    MegaXMLHttpRequestProxy.prototype.getResponseHeader = function(sName) {
      if (!bDesktop || !this.bIsUrlLocal) {
        return this._nativeXMLHttpRequest.getResponseHeader(sName);
      } else {
        return this._desktopXMLHttpRequest.getResponseHeader(sName);
      }
    };
    
    MegaXMLHttpRequestProxy.prototype.setRequestHeader = function(sName, sValue) {
      if (!bDesktop || !this.bIsUrlLocal) {
        this._nativeXMLHttpRequest.setRequestHeader(sName, sValue);
      } else {
        this._desktopXMLHttpRequest.setRequestHeader(sName, sValue);
      }
    };
    
    MegaDesktopXMLHttpRequest.prototype.addEventListener = function(sName, fHandler, bUseCapture) {
      if (!bDesktop || !this.bIsUrlLocal) {
        this._nativeXMLHttpRequest.addEventListener(sName, fHandler, bUseCapture);
      } else {
        this._desktopXMLHttpRequest.addEventListener(sName, fHandler, bUseCapture);
      }
    };
    
    MegaDesktopXMLHttpRequest.prototype.removeEventListener = function(sName, fHandler, bUseCapture) {
      if (!bDesktop || !this.bIsUrlLocal) {
        this._nativeXMLHttpRequest.removeEventListener(sName, fHandler, bUseCapture);
      } else {
        this._desktopXMLHttpRequest.removeEventListener(sName, fHandler, bUseCapture);
      }
    };
    
    MegaDesktopXMLHttpRequest.prototype.dispatchEvent = function(oEvent) {
      if (!bDesktop || !this.bIsUrlLocal) {
        this._nativeXMLHttpRequest.dispatchEvent(oEvent);
      } else {
        this._desktopXMLHttpRequest.dispatchEvent(oEvent);
      }
    };
    
    MegaXMLHttpRequestProxy.prototype.toString = function() {
      return '[' + "object" + ' ' + "XMLHttpRequest" + ']';
    };
    
    MegaXMLHttpRequestProxy.toString = function() {
      return '[' + "XMLHttpRequest" + ']';
    };
    
    window.XMLHttpRequest = MegaXMLHttpRequestProxy;
    
    // With page loaded from the disk, dojo use ActiveXObject.
    if ( window.ActiveXObject ) {
      ActiveXObject = function (progid) {
        var realObj = null;
        switch (progid) {
          case 'Msxml2.XMLHTTP':
          case 'Microsoft.XMLHTTP':
          case 'Msxml2.XMLHTTP.4.0':
          case 'MSXML2.XMLHTTP.3.0':
            var cfg = { nativeXMLHttpRequest: new nativeActiveXObject(progid) };
            realObj = new MegaXMLHttpRequestProxy(cfg);
            break;
          default:
            realObj = new nativeActiveXObject(progid);
            break;
        }
        return realObj;
      }
    }

    // Create a console object to write in the Mega ErrorLog File or visual stderr
    // Inspired from Firebug's console API
    if ( ! window.console ) {
      window.console = {
        //_megaCmd         : 'outputDebugPrint', // write in stderr
        _megaCmd         : 'errSysLogWrite',   // write in mega error log
        log              : function(sz) {
          this._sendToMegaSysErr( 'LOG: ' + sz+'\r\n');
        },
        debug            : function(sz) {
          this._sendToMegaSysErr( 'DBG: ' + sz+'\r\n');
        },
        info             : function(sz) {
          this._sendToMegaSysErr( 'INFO: ' + sz+'\r\n');
        },
        warn            : function(sz) {
          this._sendToMegaSysErr( 'WARN: ' + sz+'\r\n');
        },
        error            : function(sz) {
          this._sendToMegaSysErr( 'ERROR: ' + sz+'\r\n');
        },
        dir              : function(oObj) {
          var sz = '';
          if (oObj instanceof  Object ) {
            var szPrefix = '';
            for (var prop in oObj) {
              sz = sz + szPrefix + prop+': '+ oObj[prop] + '\r\n';
              szPrefix = '     ';
            }
          } else {
            sz = oObj+'\r\n';
          }
          this._sendToMegaSysErr( 'DIR: ' + sz);
        },
        _sendToMegaSysErr: function (sz) {
          if (Ext && Ext.Ajax && Ext.Ajax.request) {
            Ext.Ajax.request({
              url    :     'winweb.aspx?data=generationType-standard|generator-0C980D7B4D2F4895',
              failure: function() {
                alert('console._sendToMegaSysErr failure - ' + sz);
              },
              method:'POST',
              params : {
                aa  : '', // Dummy param to have easier parsing in the C++ generator
                cmd : this._megaCmd, // write in stderr
                text: sz
              }
            });
          } else {
            alert('console._sendToMegaSysErr requires Ext.Ajax.request');
            this._sendToMegaSysErr = function() {};
          }
        }
      };
    }
     
  }
})();
if (!this.JSON) {
  this.JSON = {};
}
(function() {
  function f(n) {
    return n < 10 ? '0' + n : n;
  }
  if (typeof Date.prototype.toJSON !== 'function') {
    Date.prototype.toJSON = function(key) {
      return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null;
    };
    String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
      return this.valueOf();
    };
  }
  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta = {'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;
  function quote(string) {
    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
      var c = meta[a];
      return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' : '"' + string + '"';
  }
  function str(key, holder) {
    var i,k,v,length,mind = gap,partial,value = holder[key];
    if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
      value = value.toJSON(key);
    }
    if (typeof rep === 'function') {
      value = rep.call(holder, key, value);
    }
    switch (typeof value) {case'string':return quote(value);case'number':return isFinite(value) ? String(value) : 'null';case'boolean':case'null':return String(value);case'object':if (!value) {
      return'null';
    }gap += indent;partial = [];if (Object.prototype.toString.apply(value) === '[object Array]') {
      length = value.length;
      for (i = 0; i < length; i += 1) {
        partial[i] = str(i, value) || 'null';
      }
      v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
      gap = mind;
      return v;
    }if (rep && typeof rep === 'object') {
      length = rep.length;
      for (i = 0; i < length; i += 1) {
        k = rep[i];
        if (typeof k === 'string') {
          v = str(k, value);
          if (v) {
            partial.push(quote(k) + (gap ? ': ' : ':') + v);
          }
        }
      }
    } else {
      for (k in value) {
        if (Object.hasOwnProperty.call(value, k)) {
          v = str(k, value);
          if (v) {
            partial.push(quote(k) + (gap ? ': ' : ':') + v);
          }
        }
      }
    }v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';gap = mind;return v;
    }
  }
  if (typeof JSON.stringify !== 'function') {
    JSON.stringify = function(value, replacer, space) {
      var i;
      gap = '';
      indent = '';
      if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
          indent += ' ';
        }
      } else if (typeof space === 'string') {
        indent = space;
      }
      rep = replacer;
      if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
        throw new Error('JSON.stringify');
      }
      return str('', {'':value});
    };
  }
  if (typeof JSON.parse !== 'function') {
    JSON.parse = function(text, reviver) {
      var j;
      function walk(holder, key) {
        var k,v,value = holder[key];
        if (value && typeof value === 'object') {
          for (k in value) {
            if (Object.hasOwnProperty.call(value, k)) {
              v = walk(value, k);
              if (v !== undefined) {
                value[k] = v;
              } else {
                delete value[k];
              }
            }
          }
        }
        return reviver.call(holder, key, value);
      }
      text = String(text);
      cx.lastIndex = 0;
      if (cx.test(text)) {
        text = text.replace(cx, function(a) {
          return'\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        });
      }
      if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        j = eval('(' + text + ')');
        return typeof reviver === 'function' ? walk({'':j}, '') : j;
      }
      throw new SyntaxError('JSON.parse');
    };
  }
}());
