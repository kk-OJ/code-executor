<template>
  <div>
    <a-card :title="t('Source Code')" :bordered="false" :headStyle="{backgroundColor:'#f2f2f2',height:'56px',userSelect:'none'}" >
      <template #extra>
        <div class="kk-flex">
          <a-tooltip>
            <template #title>{{ t('reset') }}</template>
            <SyncOutlined @click="resetCode" style="font-size: 18px; cursor: pointer;" />
          </a-tooltip>
          <div style="margin-left: 20px;">
            <a-dropdown trigger="click" >
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="handleMenuClick('Java')" key="Java">Java</a-menu-item>
                  <a-menu-item @click="handleMenuClick('C++')" key="C++">C++</a-menu-item>
                  <a-menu-item @click="handleMenuClick('C')" key="C">C</a-menu-item>
                  <a-menu-item @click="handleMenuClick('Python')" key="Python">Python</a-menu-item>
                  <a-menu-item @click="handleMenuClick('Javascript')" key="Javascript">Javascript</a-menu-item>
                  <a-menu-item @click="handleMenuClick('Go')" key="Go">Go</a-menu-item>
                </a-menu>
              </template>
              <a-button>
                {{ lang }}
                <DownOutlined />
              </a-button>
            </a-dropdown>
          </div>
          <div style="margin-left: 15px;">
            <a-button type="primary" :loading="loading" @click="executeCode" >{{ t('execute') }}</a-button>
          </div>
        </div>
      </template>
      <div class="kk-class">
        <AceEditor ref="codeEditorRef" @handleSave="handleSave" ></AceEditor>
      </div>
    </a-card>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import AceEditor from '../components/AceEditor';
import { DownOutlined, SyncOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'CodeEditor',
  components: {
    AceEditor,
    DownOutlined,
    SyncOutlined,
  },
  props: ['loading'],
  setup(props,context) {

    const { t } = useI18n();

    const codeEditorRef = ref();
    const lang = ref('Java');

    // 定义语言及对应的模板代码等
    const langMap = {
      'Java': {
        selectLang: 'Java',
        editorLang: 'java',
        executeLang: 'java',
        codeTemplate: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // write your code
        
    }
}`,
      },
      'C++': {
        selectLang: 'C++',
        editorLang: 'c_cpp',
        executeLang: 'c++',
        codeTemplate: `#include <iostream>
#include <cstdio>

using namespace std;

int main()
{
    // write your code
    
    return 0;
}`,
      },
      'C': {
        selectLang: 'C',
        editorLang: 'c_cpp',
        executeLang: 'c',
        codeTemplate: `#include <stdio.h>

int main()
{
    // write your code
    
    return 0;
}`
      },
      'Python': {
        selectLang: 'Python',
        editorLang: 'python',
        executeLang: 'python',
        codeTemplate: `# write your code
`,
      },
      'Javascript': {
        selectLang: 'Javascript',
        editorLang: 'javascript',
        executeLang: 'javascript',
        codeTemplate: `const fs = require('fs')
const data = fs.readFileSync('/dev/stdin')
// write your code
`,
      },
      'Go': {
        selectLang: 'Go',
        editorLang: 'golang',
        executeLang: 'golang',
        codeTemplate: `package main

func main() {
    // write your code
    
}`,
      },
    };

    // 切换语言
    const handleMenuClick = (content) => {
      lang.value = content;
      if(codeEditorRef.value) {
        codeEditorRef.value.setLanguage(langMap[lang.value].editorLang);
        if(localStorage.getItem('code-' + lang.value)) codeEditorRef.value.setValue(localStorage.getItem('code-' + lang.value));
        else codeEditorRef.value.setValue(langMap[lang.value].codeTemplate);
        codeEditorRef.value.reset();
      }
    };

    // 执行代码
    const executeCode = () => {
      let code = codeEditorRef.value.getValue();
      context.emit('executeCode', code, langMap[lang.value]);
    };


    // 重置代码
    const resetCode = () => {
      if(codeEditorRef.value) codeEditorRef.value.setValue(langMap[lang.value].codeTemplate);
    };


    // 保存代码
    const handleSave = (code) => {
      localStorage.setItem('lang', lang.value);
      localStorage.setItem('code-' + lang.value, code);
      message.success({content:t('saved'),key:t('saved')});
    };

    onMounted(() => {
      if(localStorage.getItem('lang')) {
        if(langMap[localStorage.getItem('lang')]) handleMenuClick(localStorage.getItem('lang'));
      }
      else handleMenuClick(lang.value);
      if(localStorage.getItem('code-' + lang.value)) codeEditorRef.value.setValue(localStorage.getItem('code-' + lang.value));
    });
    

    return {
      t,
      codeEditorRef,
      lang,
      handleMenuClick,
      executeCode,
      resetCode,
      handleSave,
    }
  }
}
</script>

<style scoped>
.kk-flex {
  display: flex;
  align-items: center;
}

.kk-class {
  height: calc(100vh - 106px);
  width: 100%;
}
</style>