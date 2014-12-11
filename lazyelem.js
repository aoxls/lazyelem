/*!
 * lazyelem - lazyloader for html elements
 * Author: LiXiao
 * Released under MIT license
 */

;(function(window, $) {

    'use strict';

    var $win = $(window),

        // 是否开启滚动监听
        isListening = false,

        // 被监听的元素集合
        listeners = [],

        // 回调函数集合
        callbacks = [],

        // 默认配置
        config = {
            timeout: 10,
            buffer: 100,
            loadingClass: 'lazy-loading',
            srcValue: 'lazy-src',
            bgValue: 'lazy-bg'
        },

        that, timer;


    /**
     * 全局主对象
     * @module lazyelem
     */
    var lazyelem = {

        /**
         * 初始化框架
         * @method _init
         */
        _init: function() {
            that = this;
        },

        /**
         * 添加监听元素
         * @method listen
         * @param {String} selector 用于选中元素的jQuery选择器
         * @param {String} type 元素类型，可用值 'img'|'bg'|dom'|'fn'
         * @param {Function} callback 加载后的回调函数 参数1:当前触发加载条件的jquery对象
         */
        listen: function(selector, type, callback) {
            var elements = $(selector || 'img[' + config.srcValue + ']'),
                eType = type || 'img',
                cbIndex;

            // 注册回调函数
            if (callback) {
                cbIndex = callbacks.push(callback) - 1;
            }

            // 添加元素
            elements.each(function() {
                var o = $(this);

                listeners.push({
                    type: eType,
                    obj: o,
                    callback: callback ? callbacks[cbIndex] : null
                });

                // 加上loading class
                o.addClass(config.loadingClass);
            });

            // 第一次调用时绑定窗口滚动事件
            if (!isListening) {
                that._startListen();
            }

            that.detect();
        },

        /**
         * 绑定窗口监听事件
         * @method _startListen
         */
        _startListen: function() {
            $win.bind('scroll.lazyelem', function() {
                clearTimeout(timer);
                
                timer = setTimeout(function() {
                    that.detect();
                }, config.timeout);
            });

            $win.bind('resize.lazyelem', function() {
                that.detect();
            });

            isListening = true;
        },

        /**
         * 检测所有元素是否满足加载条件
         * @method detect
         */
        detect: function() {
            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i],
                    obj = listener.obj;

                // 若元素不可见，则跳过
                if (obj.is(':hidden')) {
                    continue;
                }

                // 是否触发加载条件
                if (!that._isInScreen(obj)) {
                    continue;
                }

                // 开始加载
                switch(listener.type) {
                    case 'fn':
                        break;

                    case 'img':
                        obj.attr('src', obj.attr(config.srcValue)).removeAttr(config.srcValue);
                        break;

                    case 'bg':
                        obj.css('background-image', 'url(' + obj.attr(config.bgValue) + ')').removeAttr(config.bgValue);
                        break;

                    case 'dom':
                        var script = obj.children('script');
                        script.replaceWith(that._minHtml(script.html()));
                        break;
                }
                // 调用回调函数
                if (listener.callback) {
                    listener.callback(obj);
                }

                // 去掉loading class
                obj.removeClass(config.loadingClass);

                // 删除该项
                listeners.splice(i--, 1);
            }

            // 当所有元素加载完毕，停止监听
            if (listeners.length === 0) {
                $win.unbind('scroll.lazyelem resize.lazyelem');
            }
        },

        /**
         * 判断一个jquery对象是否在屏幕区域之间
         * @method _isInScreen
         * @param {jQuery Object} obj 单个jquery对象
         * @return {Boolean}
         */
        _isInScreen: function(obj) {
            var winHeight = $win.height(),
                winTop = $win.scrollTop(),
                oHeight = obj.height(),
                ot = obj.offset().top;

            return (ot + oHeight) > (winTop - config.buffer) && ot < (winTop + winHeight + config.buffer);
        },

        /**
         * 最小化一段html文本
         * @method _minHtml
         * @param {String} html 一段html代码文本
         * @return {String} 处理后的html文本
         */
        _minHtml: function(html) {
            var rep = /\n+/g,
                repone = /<!--.*?-->/ig,
                reptwo = /\/\*.*?\*\//ig,
                reptree = /[ ]+</ig;

            html = html.replace(rep, '');
            html = html.replace(repone, '');
            html = html.replace(reptwo, '');
            html = html.replace(reptree, '<');

            return html;
        },

        /**
         * 配置参数
         * @method config
         * @param {Object} opt 配置项 timeout|buffer|loadingClass|srcValue|bgValue
         */
        config: function(opt) {
            $.extend(config, opt);
        }
    };

    // 初始化
    lazyelem._init();

    // 附加到全局对象
    window.lazyelem = lazyelem;

})(window, jQuery);