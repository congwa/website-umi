import { ProFormUploadButton } from '@ant-design/pro-components';
import { uploadReq } from '@/services';
import { message } from 'antd';

export default (props) => {
  const customRequest = ({ file, onSuccess }) => {
    const formData = new FormData();
    formData.append('file', file);
    uploadReq(formData)
      .then((res) => {
        message.success('上传成功');
        onSuccess(`${process.env.UMI_APP_UPLOAD_URL}${res.data.url}`);
      })
      .catch(() => {
        message.error('上传错误');
      });
  };
  return (
    <ProFormUploadButton
      {...props}
      fieldProps={{
        customRequest,
        maxCount: 1,
      }}
    />
  );
};
