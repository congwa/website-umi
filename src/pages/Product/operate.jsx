import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ProTable,
  TableDropdown,
  ProFormSegmented,
  ProFormText,
  ModalForm,
  ProFormSelect,
  ProFormUploadButton,
  ProFormDependency,
  ProForm,
} from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag, message } from 'antd';
import { useRef, useState } from 'react';
import { menuAddReq, menuEditReq } from '@/services';
import {menuListReq, productAddReq, productDelReq, productDetailReq, productEditReq, productListReq, productMenuListAllReq, productMenuListReq } from '@/services';
import MyEditor from '@/components/Editor';



export default (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const type = props.type;

  const dataSource = props.dataSource;

  const menuList = props.menuList || [];

  if (type === 'edit') console.log(props)

  const config = {
    add: {
      btn: {
        icon: <PlusOutlined />,
        type: 'primary',
        text: props.text || '新建',
        requestRequest: (data) => productAddReq(data),
      },
      menuType: '1',
      defaultValue: null,
    },
    edit: {
      btn: {
        icon: '',
        type: 'link',
        text: props.text || '编辑',
        requestRequest: (data) => productEditReq(data.id, data),
      },
      menuType: props.defaultValue?.parentId ? '2' : '1',
      defaultValue: props.defaultValue || [],
    },
  };

  const currentConfig = config[type];

  console.log('defaultValue',currentConfig.defaultValue); 

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
    )
  }
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
              message: '此项为必填项,请填写',
            },
          ]}
          initialValue={currentConfig.defaultValue?.name}
          label="商品名称"
          name="name"
        />
        <ProFromEditor
          rules={[
            {
              required: true,
              message: '此项为必填项',
            },
          ]}
          initialValue={currentConfig.defaultValue?.description}
          label="内容"
          name="description"
        >

        </ProFromEditor>
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
