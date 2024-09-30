<template>
  <div>
    <a-card :title="t('Run Results')" :headStyle="{backgroundColor:'#f2f2f2',height:'56px',userSelect:'none'}" :bodyStyle="{backgroundColor:'#fdfdfd'}" >
      <template #extra>
        <a-tooltip>
          <template #title>Github</template>
          <GithubOutlined @click="toGithub" style="font-size: 20px; cursor: pointer;" />
        </a-tooltip>
      </template>
      <div class="kk-class">
        <div>
          <a-card :title="t('Input Data')" :headStyle="{backgroundColor:'#f2f2f2',userSelect:'none'}" >
            <template #extra>
              <div>
                <a-tooltip>
                  <template #title>{{ t('Upload Input') }}</template>
                  <a-upload
                    :customRequest="parseInput"
                    :showUploadList="false"
                  >
                  <ImportOutlined style="font-size: 18px; cursor: pointer;" />
                  </a-upload>
                </a-tooltip>
              </div>
            </template>
          </a-card>
          <a-spin :spinning="loadingInput" >
            <a-textarea autoSize size="large" v-model:value="input" placeholder="" allow-clear :maxlength="input_max_len" />
          </a-spin> 
        </div>
        <div style="height: 40px;"></div>
        <div>
          <a-card :title="t('Output Result')" :headStyle="{backgroundColor:'#f2f2f2',userSelect:'none'}" >
            <template #extra>
              <div>
                <a-tooltip>
                  <template #title>{{ t('Copy Output') }}</template>
                  <CopyOutlined style="font-size: 18px;" @click="doCopy(output)" />
                </a-tooltip>
              </div>
            </template>
            <a-spin :spinning="loading" >
              <div class="kk-card-body">
                <pre>{{ !(output && output.length > 0) ? t('No Output Result') : output }}</pre>
              </div>
            </a-spin>
          </a-card>
        </div>
        <div style="height: 40px;"></div>
        <div>
          <a-card :title="t('Error Message')" :headStyle="{backgroundColor:'#f2f2f2',userSelect:'none'}" :bodyStyle="{color:'#f63636'}" >
            <template #extra>
              <div>
                <a-tooltip>
                  <template #title>{{ t('Copy Error') }}</template>
                  <CopyOutlined style="font-size: 18px;" @click="doCopy(stderr)" />
                </a-tooltip>
              </div>
            </template>
            <a-spin :spinning="loading" >
              <div class="kk-card-body">
                <pre>{{ !(stderr && stderr.length > 0) ? t('No Error Message') : stderr }}</pre>
              </div>
            </a-spin>
          </a-card>
        </div>
      </div>    
    </a-card>
  </div>
</template>

<script>
import { ref } from 'vue';
import { CopyOutlined, GithubOutlined, ImportOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import useClipboard from "vue-clipboard3";
import { useI18n } from 'vue-i18n';

export default {
  name: 'ResultInfo',
  components: {
    CopyOutlined,
    GithubOutlined,
    ImportOutlined,
  },
  props:['loading'],
  setup() {

    const { t } = useI18n();

    const input_max_len = ref(1024);
    const input = ref('');
    const output = ref('');
    const stderr = ref('');

    // 复制
    const { toClipboard } = useClipboard();
    const doCopy = async (content) => {
      if(content && content.length > 0) {
        await toClipboard(content);
        message.success({content:t('copied'),key:t('copied')});
      }
      else message.warning({content:t('contentless'),key:t('contentless')});
    };

    // 前往GitHub页面
    const toGithub = () => {
      window.open("https://github.com/kk-OJ/code-judge", "_blank");
    };

    // 上传输入
    const loadingInput = ref(false);
    const parseInput = (data) => {
      let file = data.file;
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const content = fileReader.result;
        input.value = content;
        message.success({content:t('Read Input Successfully'),key:t('Read Input Successfully')});
        loadingInput.value = false;
      };
      fileReader.onerror = () => {
        message.error({content:t('Read Input Failed'),key:t('Read Input Failed')});
        loadingInput.value = false;
      };
      loadingInput.value = true;
      fileReader.readAsText(file.slice(0, input_max_len.value));
    };

    return {
      t,
      input,
      output,
      stderr,
      doCopy,
      toGithub,
      parseInput,
      loadingInput,
      input_max_len,
    }
  }
}
</script>

<style scoped>
.global {
  background-color: #ff0000;
}

.kk-card-body {
  overflow-x: auto;
}

pre {
  margin: 0 0;
}

.kk-class {
  min-height: calc(100vh - 106px);
  width: 100%;
}
</style>