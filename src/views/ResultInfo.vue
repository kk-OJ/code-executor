<template>
  <div>
    <a-card title="运行结果" :headStyle="{backgroundColor:'#f2f2f2',height:'56px',userSelect:'none'}" :bodyStyle="{backgroundColor:'#fdfdfd'}" >
      <template #extra>
        <GithubOutlined @click="toGithub" style="font-size: 20px; cursor: pointer;" />
      </template>
      <div class="kk-class">
        <div>
          <a-card title="输入数据" :headStyle="{backgroundColor:'#f2f2f2',userSelect:'none'}" >
          </a-card>
          <a-textarea autoSize size="large" v-model:value="input" placeholder="" allow-clear />
        </div>
        <div style="height: 40px;"></div>
        <div>
          <a-card title="输出结果" :headStyle="{backgroundColor:'#f2f2f2',userSelect:'none'}" >
            <template #extra>
              <div>
                <CopyOutlined style="font-size: 18px;" @click="doCopy(output)" />
              </div>
            </template>
            <a-spin :spinning="loading" >
              <div class="kk-card-body preserve-space">
                {{ !(output && output.length > 0) ? '无输出结果' : output }}
              </div>
            </a-spin>
          </a-card>
        </div>
        <div style="height: 40px;"></div>
        <div>
          <a-card title="错误信息" :headStyle="{backgroundColor:'#f2f2f2',userSelect:'none'}" :bodyStyle="{color:'#f63636'}" >
            <template #extra>
              <div>
                <CopyOutlined style="font-size: 18px;" @click="doCopy(stderr)" />
              </div>
            </template>
            <a-spin :spinning="loading" >
              <div class="kk-card-body preserve-space">
                {{ !(stderr && stderr.length > 0) ? '无错误信息' : stderr }}
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
import { CopyOutlined, GithubOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import useClipboard from "vue-clipboard3";

export default {
  name: 'ResultInfo',
  components: {
    CopyOutlined,
    GithubOutlined,
  },
  props:['loading'],
  setup() {

    const input = ref('');
    const output = ref('');
    const stderr = ref('');

    // 复制
    const { toClipboard } = useClipboard();
    const doCopy = async (content) => {
      if(content && content.length > 0) {
        await toClipboard(content);
        message.success("复制成功");
      }
      else message.warning("内容为空");
    }

    // 前往GitHub页面
    const toGithub = () => {
      window.open("https://github.com/zyyzyykk/code-judge", "_blank");
    }

    return {
      input,
      output,
      stderr,
      doCopy,
      toGithub,
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

.preserve-space {
  white-space: pre;
}

.kk-class {
  min-height: calc(100vh - 106px);
  width: 100%;
}
</style>