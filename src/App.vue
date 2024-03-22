<template>
  <div style="height: 100vh; padding: 0 0;">
    <a-split :style="{
        height: '100vh',
        border: '1px solid var(--color-border)'
      }"
      min="350px"
    >
      <template #first>
        <CodeEditor :loading="loading" @executeCode="executeCode" ></CodeEditor>
      </template>
      <template #second>
        <ResultInfo :loading="loading" ref="resultInfoRef"></ResultInfo>
      </template>
    </a-split>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import $ from 'jquery';
import { message } from 'ant-design-vue';

import ResultInfo from './views/ResultInfo';
import CodeEditor from './views/CodeEditor';

export default {
  name: 'App',
  components: {
    CodeEditor,
    ResultInfo,
  },
  setup() {

    const loading = ref(false);
    const AccessKey = ref('');
    const SecretKey = ref('');

    const base_url = 'http://120.27.246.64:3000';

    // 获取执行密钥
    const getExecuteKey = () => {
      if(localStorage.getItem('AccessKey') && localStorage.getItem('SecretKey')) {
        AccessKey.value = localStorage.getItem('AccessKey');
        SecretKey.value = localStorage.getItem('SecretKey');
      }
      $.ajax({
          url:base_url + '/api/getApiKey',
          type:'get',
          success(resp) {
            if(resp.code == 200) {
              AccessKey.value = resp.data.AccessKey;
              SecretKey.value = resp.data.SecretKey;
              localStorage.setItem('AccessKey',resp.data.AccessKey);
              localStorage.setItem('SecretKey',resp.data.SecretKey);
            }
          }
      });
    };

    // 执行代码
    const resultInfoRef = ref();
    const executeCode = (code,langInfo) => {
      loading.value = true;
      let data = {
        code:code,
        lang:langInfo.executeLang,
      };
      if(resultInfoRef.value.input && resultInfoRef.value.input.length > 0) {
        data = {...data, inputs: [resultInfoRef.value.input]}
      }
      $.ajax({
          url:base_url + '/api/execode',
          type:'post',
          headers:{
            'Authorization': 'Bearer ' + AccessKey.value + ' ' + SecretKey.value
          },
          data:data,
          success(resp) {
            if(resp.code != 200) {
              message.error({content:resp.info,key:resp.info});
            }
            else if(resp.data.executeType == '执行成功') {
              resultInfoRef.value.output = resp.data.stdout[0];
              resultInfoRef.value.stderr = resp.data.stderr[0];
            }
            else {
              resultInfoRef.value.output = '';
              resultInfoRef.value.stderr = resp.data.executeDetail;
            }
            if(code && code.length > 0) {
              localStorage.setItem('code-' + langInfo.selectLang, code);
              localStorage.setItem('lang', langInfo.selectLang);
            }
            loading.value = false;
          }
      });
    }

    onMounted(() => {
      getExecuteKey();
      setInterval(() => {
        getExecuteKey();
      }, 40*60*1000);
    })

    return {
      loading,
      executeCode,
      resultInfoRef,
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  padding: 0;
  border: 0;
  outline: 0;
}
</style>
