import React, { useState, useEffect } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';

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

  const toolbarConfig = {};
  let editorConfig = {
    placeholder: '请输入内容...',
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
      ['codeSelectLang']: {
        codeLangs: [
          { text: 'CSS', value: 'css' },
          { text: 'HTML', value: 'html' },
          { text: 'XML', value: 'xml' },
          // 其他
          { text: 'JavaScript', value: 'javascript' },
        ],
      },
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
        style={{ height: '500px' }}
      />
    </>
  );
}

export default MyEditor;
