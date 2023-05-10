import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ProTable,
  TableDropdown,
  ProFormText,
  ModalForm,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import {
  bannerAddReq,
  bannerDelReq,
  bannerDetailReq,
  bannerEditReq,
  bannerListReq,
} from '@/services';
import MyUpload from '@/components/Upload';

export default (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Button
        onClick={() => setModalVisible(true)}
        key="button"
        icon={<PlusOutlined />}
        type="primary"
      >
        新建
      </Button>
      <ModalForm
        title="新建banner"
        open={modalVisible}
        modalProps={{
          onCancel: () => setModalVisible(false),
        }}
        onFinish={async (values) => {
          console.log(process.env.UMI_APP_UPLOAD_URL);
          await bannerAddReq({
            ...values,
            // ${process.env.UMI_APP_UPLOAD_URL}
            imageUrl: `${values.image[0].response}`,
          });
          setModalVisible(false);
          props.reload && props.reload();
        }}
        submitter={{
          searchConfig: {
            submitText: '保存',
          },
          render: (_, dom) => dom.pop(),
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '此项为必填项',
            },
          ]}
          label="标题"
          name="title"
        />
        <MyUpload
          rules={[{ required: true, message: '请上传图片' }]}
          label="图片"
          name="image"
          fieldProps={{ listType: 'picture', maxCount: 1 }}
          extra="请上传格式为 jpg、jpeg、png 的图片"
        />
        <ProFormText label="跳转链接" name="linkUrl" />
      </ModalForm>
    </>
  );
};
