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
} from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag, message } from 'antd';
import { useRef, useState } from 'react';
import { menuAddReq, menuEditReq } from '@/services';

export default (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const type = props.type;

  const dataSource = props.dataSource;

  // if (type === 'edit') console.log(props)

  const config = {
    add: {
      btn: {
        icon: <PlusOutlined />,
        type: 'primary',
        text: props.text || '新建',
        requestRequest: (data) => menuAddReq(data),
      },
      menuType: '1',
      defaultValue: null,
    },
    edit: {
      btn: {
        icon: '',
        type: 'link',
        text: props.text || '编辑',
        requestRequest: (data) => menuEditReq(data.id, data),
      },
      menuType: props.defaultValue?.parentId ? '2' : '1',
      defaultValue: props.defaultValue || [],
    },
  };

  const currentConfig = config[type];

  const handleSave = async (id, row) => {
    await currentConfig.btn.requestRequest({
      id: currentConfig.defaultValue?.id || id,
      ...row,
    });
    props.onRefresh && props.onRefresh();
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
        <ProFormSegmented
          name="menuType"
          label="菜单类型"
          initialValue={currentConfig.menuType}
          disabled={type === 'edit'}
          valueEnum={{
            1: {
              text: '一级菜单',
            },
            2: {
              text: '二级菜单',
            },
          }}
          rules={[{ required: true, message: '请选择菜单类型' }]}
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '此项为必填项',
            },
          ]}
          initialValue={currentConfig.defaultValue?.name}
          label="标题"
          name="name"
        />
        <ProFormText
          label="跳转链接"
          name="url"
          initialValue={currentConfig.defaultValue?.url}
        />
        <ProFormDependency
          key="menuType-url"
          name={['menuType', 'url']}
          ignoreFormListField
        >
          {({ menuType, url }) => {
            if (menuType === '1') {
            } else if (menuType === '2') {
              return (
                <ProFormSelect
                  options={dataSource.map((item) => {
                    return {
                      value: item.id,
                      label: item.name,
                    };
                  })}
                  initialValue={currentConfig.defaultValue?.parentId}
                  name="parentId"
                  label="选择父菜单"
                  rules={[
                    {
                      required: true,
                      message: '此项为必填项',
                    },
                  ]}
                />
              );
            }
          }}
        </ProFormDependency>
      </ModalForm>
    </>
  );
};
