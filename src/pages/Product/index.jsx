import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag, Popconfirm, message } from 'antd';
import { useRef, useEffect, useState } from 'react';
import { WhileType } from '@/config';
import {
  menuListReq,
  productAddReq,
  productDelReq,
  productDetailReq,
  productEditReq,
  productListReq,
  productMenuListAllReq,
  productMenuListReq,
  menuListChildReq,
} from '@/services';
import Operate from './operate';

export default () => {
  const actionRef = useRef();
  const [menuList, setMenuList] = useState([]);
  useEffect(() => {
    onMenuListReq();
  }, []);
  const onMenuListReq = async () => {
    const data = await menuListChildReq(WhileType.PROJECT);
    console.log(data, 'menulist');
    setMenuList(
      data.data.map((item) => {
        return {
          ...item,
          key: item.id,
          label: item.name,
          value: item.id,
        };
      }),
    );
  };

  const onDelete = async (id) => {
    try {
      await productDelReq(id);
      actionRef.current.reload();
      message.success('删除成功');
    } catch (error) {
      console.log(error);
    }
  };
  const columns = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      tip: '标题过长会自动收缩',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '所属菜单',
      dataIndex: 'menuId',
      copyable: true,
      ellipsis: true,
      tip: '所属菜单',
      onFilter: true,
      valueEnum: menuList.reduce((pre, item) => {
        pre[item.value] = { text: item.label };
        return pre;
      }, {}),
      tableRender: (text, record) => {
        return (
          <span>
            {menuList.find((item) => item.value === record.menuId)?.label ||
              '-'}
          </span>
        );
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必选项',
          },
        ],
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <Operate
          menuList={menuList}
          key="edit"
          type="edit"
          text="编辑"
          dataSource={record}
          onRefresh={() => actionRef.current.reload()}
          defaultValue={record}
        ></Operate>,
        <Popconfirm
          key="del"
          title="Delete the task"
          description="Are you sure to delete this task?"
          onConfirm={() => onDelete(record.id)}
          onCancel={() => {}}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <ProTable
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(
          {
            ...params,
            page: params.current,
            pageSize: params.pageSize,
            menuId: params.menuId ? +params.menuId : null,
          },
          sort,
          filter,
        );
        const data = await productListReq({
          ...params,
          page: params.current,
          pageSize: params.pageSize,
          menuId: params.menuId ? +params.menuId : null,
        });
        console.log(data);
        return {
          data: data.data.list,
          success: true,
          total: data.data.count,
        };
      }}
      rowKey="id"
      editable={false}
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      pagination={{
        pageSize: 10,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="产品列表"
      toolBarRender={() => [
        <Operate
          key="add"
          type="add"
          text="新建"
          dataSource={{}}
          onRefresh={() => actionRef.current.reload()}
          menuList={menuList}
        ></Operate>,
      ]}
    />
  );
};
