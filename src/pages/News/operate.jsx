import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ProTable,
  TableDropdown,
  ProFormSegmented,
  ProFormText,
  ModalForm,
  ProFormTextArea,
  ProFormSelect,
  ProFormUploadButton,
  ProFormDependency,
  ProForm,
} from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag, message } from 'antd';
import { useRef, useState } from 'react';
import { menuAddReq, menuEditReq } from '@/services';
import {
  menuListReq,
  newsAddReq,
  newsDelReq,
  newsDetailReq,
  newsEditReq,
  newsListReq,
  newsMenuListAllReq,
  newsMenuListReq,
} from '@/services';
import MyEditor from '@/components/Editor';

export default (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const type = props.type;

  const dataSource = props.dataSource;

  const menuList = props.menuList || [];

  if (type === 'edit') console.log(props);

  const config = {
    add: {
      btn: {
        icon: <PlusOutlined />,
        type: 'primary',
        text: props.text || '新建',
        requestRequest: (data) => newsAddReq(data),
      },
      menuType: '1',
      defaultValue: null,
    },
    edit: {
      btn: {
        icon: '',
        type: 'link',
        text: props.text || '编辑',
        requestRequest: (data) => newsEditReq(data.id, data),
      },
      menuType: props.defaultValue?.parentId ? '2' : '1',
      defaultValue: props.defaultValue || [],
    },
  };

  const currentConfig = config[type];

  console.log('defaultValue', currentConfig.defaultValue);

  const handleSave = async (id, row) => {
    await currentConfig.btn.requestRequest({
      id: currentConfig.defaultValue?.id || id,
      ...row,
    });
    props.onRefresh && props.onRefresh();
  };

  const ProFromEditor = (props) => {
    return (
      <ProForm.Item {...props}>
        <MyEditor {...props.fieldProps} />
      </ProForm.Item>
    );
  };
  return (
    <>
      <Button
        onClick={() => setModalVisible(true)}
        key="button"
        icon={currentConfig.btn.icon}
        type={currentConfig.btn.type}
      >
        {currentConfig.btn.text}
      </Button>

      <ModalForm
        title={currentConfig.btn.text}
        open={modalVisible}
        modalProps={{
          onCancel: () => setModalVisible(false),
        }}
        onFinish={async (values) => {
          try {
            await handleSave(currentConfig.defaultValue?.id, values);
            setModalVisible(false);
            message.success('保存成功');
          } catch (error) {
            message.error('失败');
          }
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
              message: '此项为必填项，请填写',
            },
          ]}
          initialValue={currentConfig.defaultValue?.title}
          label="新闻标题"
          name="title"
        />
        <ProFormTextArea
          rules={[
            {
              required: true,
              message: '此项为必填项，请填写',
            },
          ]}
          initialValue={currentConfig.defaultValue?.subTitle}
          label="新闻的简短描述信息"
          name="subTitle"
        />
        <ProFormUploadButton
          rules={[{ required: true, message: '请上传图片' }]}
          label="图片"
          name="image"
          action="/v1/upload/album"
          headers={{ Authorization: 'Bearer ' + localStorage.getItem('token') }}
          fieldProps={{ listType: 'picture', maxCount: 1 }}
          extra="请上传格式为 jpg、jpeg、png 的图片"
        />
        <ProFromEditor
          rules={[
            {
              required: true,
              message: '此项为必填项',
            },
          ]}
          initialValue={currentConfig.defaultValue?.content}
          label="新闻内容"
          name="content"
        ></ProFromEditor>
        <ProFormSelect
          options={menuList}
          initialValue={currentConfig.defaultValue?.menuId}
          name="menuId"
          label="选择父菜单"
          rules={[
            {
              required: true,
              message: '此项为必填项',
            },
          ]}
        />
      </ModalForm>
    </>
  );
};
