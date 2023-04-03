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
        defaultValue: null,
        requestRequest: (data) => menuAddReq(data),
      },
    },
    edit: {
      btn: {
        icon: '',
        type: 'link',
        text: props.text || '编辑',
      },
      defaultValue: props.defaultValue || [],
      requestRequest: () => menuEditReq,
    },
  };

  const currentConfig = config[type];

  const handleSave = async (id, row) => {
    try {
      await currentConfig[type].requestRequest({
        id,
        ...row,
      });
      props.onRefresh && props.onRefresh();
    } catch (error) {
      console.log(error);
    }
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
            await handleSave(values.id, values);
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
          initialValue={'1'}
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
          label="标题"
          name="name"
        />
        <ProFormText label="跳转链接" name="url" />
        <ProFormDependency
          key="menuType-url"
          name={['menuType', 'url']}
          ignoreFormListField
        >
          {({ menuType, url }) => {
            console.log(menuType, url, '----------');
            if (menuType === '1') {
            } else if (menuType === '2' && !url) {
              return (
                <ProFormSelect
                  options={dataSource.map((item) => {
                    return {
                      value: item.id,
                      label: item.name,
                    };
                  })}
                  name="parentId"
                  label="选择父菜单"
                />
              );
            }
          }}
        </ProFormDependency>
      </ModalForm>
    </>
  );
};
