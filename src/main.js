import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);

// Arco Design
import '@arco-design/web-vue/dist/arco.css';
import { Split } from '@arco-design/web-vue';
app.use(Split);

// Ant Design Vue
import 'ant-design-vue/dist/reset.css';
import { Card,Dropdown,Menu,MenuItem,Button,Input,Spin,Tooltip,Upload } from 'ant-design-vue';
app.use(Card).use(Dropdown).use(Menu).use(MenuItem).use(Button).use(Input).use(Spin).use(Tooltip).use(Upload);

app.mount('#app');