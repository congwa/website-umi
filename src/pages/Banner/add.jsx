import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { ProTable, TableDropdown, ProFormText, ModalForm, ProFormUploadButton } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import { bannerAddReq, bannerDelReq, bannerDetailReq, bannerEditReq, bannerListReq } from '@/services';

export default () => {
  const [modalVisible, setModalVisible] = useState(false);
  return <>
    <Button onClick={() => setModalVisible(true)} key="button" icon={<PlusOutlined />} type="primary">
      新建
    </Button>
    <ModalForm
      title="新建banner"
      open={modalVisible}
      modalProps={{
        onCancel: () => setModalVisible(false),
      }}
      onFinish={async (values) => {
        // console.log(values)
        // console.log({ ...values, imageUrl: values.imageUrl[0].response.data.url })
        await bannerAddReq({ ...values, imageUrl: values.imageUrl[0].response.data.url });
        setModalVisible(false);
        actionRef.current?.reload();
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
      <ProFormUploadButton
          rules={[{ required: true, message: '请上传图片' }]}
          label="图片"
          name="imageUrl"
          action="/v1/upload/album"
          fieldProps={{ listType: 'picture', maxCount: 1 }}
          extra="请上传格式为 jpg、jpeg、png 的图片"
        />
      <ProFormText label="跳转链接" name="linkUrl" />
    </ModalForm>
  </>
}
