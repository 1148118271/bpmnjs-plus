/**
 * @description 全局功能封装
 * @author zr
 * @type {{registerFileDrop(*, *): void, saveBpmn(Object): void, handleDragOver(*): void, setColor(Object): void, downLoad(Object): void, upload(Object, Object, Object): void, handleFileSelect(*): void, setEncoded(Object, string, string): void, openFromUrl(Object, Object, Object, string): void, createDiagram(string, Object, Object): Promise<void>, getUrlParam: tools.getUrlParam}}
 */

import $ from 'jquery';
const tools = {
    registerFileDrop(container, callback) {
        container.get(0).addEventListener('dragover', tools.handleDragOver, false);
        container.get(0).addEventListener('drop', tools.handleFileSelect, false);
    },
    handleFileSelect(e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files;
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var xml = e.target.result;
            callback(xml);
        };
        reader.readAsText(file);
    },
    handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    },
    /**
     * 获取地址栏参数
     * @param {string} value
     */
    getUrlParam: function (url) {
        var object = {};
        if (url.indexOf("?") != -1) {
            var str = url.split("?")[1];
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                object[strs[i].split("=")[0]] = strs[i].split("=")[1]
            }
            return object
        }
        return object[url];
    },
    /**
     * 通过xml创建bpmn
     * @param {string} xml 创建bpms xml
     * @param {object} bpmnModeler bpmn对象
     * @param {object} container 容器对象
     */
    async createDiagram(xml, bpmnModeler, container) {
        try {
            await bpmnModeler.importXML(xml);
            container.removeClass('with-error').addClass('with-diagram');
        } catch (err) {
            container.removeClass('with-diagram').addClass('with-error');
            container.find('.error pre').text(err.message);
            console.error(err);
        }
    },
    /**
     * 下载bpmn
     * @param {object} bpmnModeler bpmn对象
     */
    downLoad(bpmnModeler) {
        var downloadLink = $("#saveBpmn")
        bpmnModeler.saveXML({format: true}, function (err, xml) {
            if (err) {
                return console.error('could not save BPMN 2.0 diagram', err);
            }
            tools.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
        });
    },
    /**
     * 转码xml并下载
     * @param {object} link 按钮
     * @param {string} name 下载名称
     * @param {string} data base64XML
     */
    setEncoded(link, name, data) {
        var encodedData = encodeURIComponent(data);
        if (data) {
            link.addClass('active').attr({
                'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
                'download': name
            });
        } else {
            link.removeClass('active');
        }
    },
    /**
     * 上传bpmn
     * @param {object} bpmnModeler bpmn对象
     * @param {object} container 容器对象
     */
    upload(bpmnModeler, container) {
        let file = document.myForm.uploadFile.files[0];
        let read = new FileReader();
        let _this = this
        read.onload = function () {
            _this.registerFileDrop(container, _this.createDiagram(this.result, bpmnModeler, container));
        }
        read.readAsText(file)
    },


    /**
     * 修改camunda为activiti
     * @param json
     */
    camundaChangeActiviti(xmlfile) {
        const objXML = xmlfile.replace(/camunda/gi, "activiti");
        return objXML;
    },
    /**
     * 修改activiti为camunda
     * @param json
     */
    acitvitiChangeCamunda(xmlfile) {
        const objXML = xmlfile.replace(/activiti/gi, "camunda");
        return objXML;
    },

}


export default tools
