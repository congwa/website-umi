import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uploadReq } from '@/services/upload';

const CustomRichTextEditor = ({ value, onChange }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleChange = (value) => {
    setContent(value);
    onChange(value);
  };

  const handleImageUpload = (callback) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file); // 将文件添加到 FormData 中

      try {
        const response = await uploadReq(formData);

        console.log(response);

        // 上传成功，执行回调函数
        const url = response.data.url; // 获取图片链接
        const range = quill.current.getSelection(true);
        const index = range.index + range.length;
        quill.current.insertEmbed(index, 'image', url); // 插入图片
        quill.current.setSelection(index + 1); // 将光标定位到下一行
        callback(); // 执行回调
      } catch (err) {
        console.error('Failed to upload the image', err);
      }
    });

    input.click();
  };
  return (
    <ReactQuill
      value={content}
      onChange={handleChange}
      style={{ maxHeight: 500, height: 300 }}
      modules={{
        toolbar: {
          container: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
          ],
        },
      }}
    />
  );
};

export default CustomRichTextEditor;
