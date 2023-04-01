import React, { useState, useEffect } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import { Boot } from '@wangeditor/editor';
import linkCardModule from '@wangeditor/plugin-link-card';
import attachmentModule from '@wangeditor/plugin-upload-attachment';
import markdownModule from '@wangeditor/plugin-md';
import ctrlEnterModule from '@wangeditor/plugin-ctrl-enter';

Boot.registerModule(attachmentModule);
Boot.registerModule(markdownModule);
Boot.registerModule(ctrlEnterModule);

// 注册。要在创建编辑器之前注册，且只能注册一次，不可重复注册。
Boot.registerModule(linkCardModule);

function MyEditor(props) {
  const [editor, setEditor] = useState(null); // 存储 editor 实例
  const { value, onChange } = props;

  useEffect(() => {
    return () => {
      if (editor === null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  const toolbarConfig = {
    insertKeys: {
      index: 0, // 自定义插入的位置
      keys: ['uploadAttachment'], // “上传附件”菜单
    },
  };
  let editorConfig = {
    placeholder: '请输入内容...',
    hoverbarKeys: {
      // 在编辑器中，选中链接文本时，要弹出的菜单
      link: {
        menuKeys: [
          'editLink',
          'unLink',
          'viewLink', // 默认的配置可以通过 `editor.getConfig().hoverbarKeys.link` 获取
          'convertToLinkCard', // 增加 '转为链接卡片'菜单
        ],
      },
    },
    MENU_CONF: {
      ['uploadImage']: {
        server: '/v1/upload/album',
        fieldName: 'file',
        customInsert(res, insertFn) {
          // TS 语法
          // 从 res 中找到 url alt href ，然后插入图片
          const url = `${process.env.UMI_APP_UPLOAD_URL}${res.data.url}`;
          console.log(url);
          const alt = res.data.originalname;
          insertFn(url, alt, url);
        },
      },
      ['uploadVideo']: {
        server: '/v1/upload/album',
        fieldName: 'file',
        customInsert(res, insertFn) {
          // TS 语法
          // 从 res 中找到 url alt href ，然后插入图片
          const url = `${process.env.UMI_APP_UPLOAD_URL}${res.data.url}`;
          console.log(url);
          const alt = res.data.originalname;
          // 固定视频封面
          insertFn(
            url,
            'http://www.biomed168.com//public/uploads/e4ff9d6a1aad31d8e3df221a1a2ae11b.jpg',
          );
        },
      },
      ['uploadAttachment']: {
        server: '/v1/upload/album',
        fieldName: 'file',
        customInsert(res, file, insertFn) {
          // TS 语法
          const url = `${process.env.UMI_APP_UPLOAD_URL}${res.data.url}`;
          console.log(url);
          const alt = res.data.originalname;
          insertFn(alt, url);
        },
      },
      ['codeSelectLang']: {
        codeLangs: [
          { text: 'CSS', value: 'css' },
          { text: 'HTML', value: 'html' },
          { text: 'XML', value: 'xml' },
          // 其他
          { text: 'JavaScript', value: 'javascript' },
        ],
      },

      // convertToLinkCard: {
      //   // 自定义获取 link-card 信息，可选
      //   // 返回 { title, iconImgSrc }
      //   async getLinkCardInfo(linkText, linkUrl) {
      //     // 1. 可通过 iframe 加载网页，然后获取网页 title 和其中的图片
      //     // 2. 服务端获取（有些网页会设置 `X-Frame-Options` ，无法通过 iframe 加载）

      //     // // 模拟异步返回
      //     return new Promise(resolve => {
      //       setTimeout(() => {
      //         const info = { title: linkText, iconImgSrc: '' }
      //         resolve(info)
      //       }, 100)
      //     })
      //   }
      // },
    },
  };

  return (
    <>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid #ccc' }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={value}
        onCreated={setEditor}
        onChange={(editor) => onChange(editor.getHtml())}
        mode="default"
        style={{}}
      />
    </>
  );
}

export default MyEditor;
