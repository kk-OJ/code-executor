import { createApp } from 'vue';
import App from './App.vue';

// 导入语言文件
import en from './locales/en_US.json';
import cn from './locales/zh_CN.json';
import hk from './locales/zh_HK.json';

import { createI18n } from 'vue-i18n';
import $ from 'jquery';

// Element-Plus
import 'element-plus/dist/index.css';
import { ElLoading } from 'element-plus';

let loading = null;

// 全屏加载
const Loading = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
  });
  return loading;
};

let locale = 'en';

// 国际化
const getCountry = () => {
  $.ajax({
    url:'https://ipapi.co/json/',
    type:'get',
    beforeSend: function() {
      loading = Loading();
    },
    success(resp) {
      try {
        const countryCode = resp.country_code;
        if (countryCode === 'CN') locale = 'cn';
        else if(countryCode === 'HK' || countryCode === 'MO' || countryCode === 'TW') locale = 'hk';
        else locale = 'en'; 
      } finally {
        initializeApp(locale);
      }
    },
    error() {
      initializeApp(locale);
    },
    complete: function() {
      loading.close();
    }
  });
};

getCountry();

// Arco Design
import '@arco-design/web-vue/dist/arco.css';
import { Split } from '@arco-design/web-vue';

// Ant Design Vue
import 'ant-design-vue/dist/reset.css';
import { Card,Dropdown,Menu,MenuItem,Button,Input,Spin,Tooltip,Upload } from 'ant-design-vue';

const initializeApp = (locale) => {
  const i18n = createI18n({
    locale: locale,
    fallbackLocale: 'en',
    messages: { en, cn, hk },
  });
  const app = createApp(App);
  app.use(i18n);
  app.use(Split);
  app.use(Card).use(Dropdown).use(Menu).use(MenuItem).use(Button).use(Input).use(Spin).use(Tooltip).use(Upload);
  app.mount('#app');
};