<template>
  <div ref="aceEditorRef" class="kk-code-editor"></div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-chrome';

// 引入语言高亮样式
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';

// 引入智能提示
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/snippets/java';
import 'ace-builds/src-noconflict/snippets/javascript';
import 'ace-builds/src-noconflict/snippets/golang';
import 'ace-builds/src-noconflict/snippets/python';
import 'ace-builds/src-noconflict/snippets/c_cpp';


export default {
  name: 'AceEditor',
  setup(props, context) {
    const aceEditorRef = ref();
    const aceEditor = ref(null);

    // 赋值内容
    const setValue = (text) => {
      if(aceEditor.value) aceEditor.value.setValue(text);
      if(aceEditor.value) aceEditor.value.selection.clearSelection();
    };

    // 获取代码
    const getValue = () => {
      if(aceEditor.value) return aceEditor.value.getValue();
      else return '';
    };

    // 保存代码
    const CtrlS = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
          case 's':
            event.preventDefault();
            context.emit('handleSave', aceEditor.value.getValue());
            break;
        }
      }
    };

    // 清空撤销历史
    const reset = () => {
      if(aceEditor.value) aceEditor.value.getSession().getUndoManager().reset();
    }
    // 设置语言
    const setLanguage = (lang) => {
      if(aceEditor.value) aceEditor.value.getSession().setMode(`ace/mode/${lang}`);
    };
    // 实例化编辑器
    onMounted(() => {
      aceEditor.value = ace.edit(aceEditorRef.value, {
        autoScrollEditorIntoView: false,
        copyWithEmptySelection: false,
        showPrintMargin: false,
        highlightActiveLine: true,
        fontFamily: 'Consolas',
        fontSize: '13px',
        enableBasicAutocompletion: true,                      // 启用基本自动补全
        enableSnippets: true,                                 // 启用代码片段
        enableLiveAutocompletion: true,                       // 启用实时自动补全
        theme: 'ace/theme/chrome',                            // 主题
        mode: 'ace/mode/java',                                // 高亮
      });

      // 查找替换
      aceEditor.value.find('needle',{
        backwards: false,
        wrap: false,
        caseSensitive: false,
        wholeWord: false,
        regExp: false
      });
      aceEditor.value.findNext();
      aceEditor.value.findPrevious();

      // 监听保存键 ctrl+s
      aceEditorRef.value.addEventListener('keydown', CtrlS);
    });

    onUnmounted(() => {
      if(aceEditorRef.value) aceEditorRef.value.removeEventListener('keydown', CtrlS);
    });

    return {
      aceEditorRef,
      aceEditor,
      setValue,
      reset,
      setLanguage,
      getValue,
    }
  }
}
</script>

<style scoped>
.kk-code-editor {
  height: 100%;
  width: 100%;
  border: 1px solid #ececec;
}
</style>