import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag, Image, message } from 'antd';
import { useRef } from 'react';
import { request } from '@umijs/max';
import {
  bannerAddReq,
  bannerDelReq,
  bannerDetailReq,
  bannerEditReq,
  bannerListReq,
} from '@/services';
import AddModel from './add';

const columns = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '标题',
    dataIndex: 'title',
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
    title: '图片',
    dataIndex: 'imageUrl',
    // valueType: 'image',
    key: 'imageUrl',
    render: (text, record) => (
      <Image
        height={100}
        src={
          record.imageUrl.includes('https://')
            ? record.imageUrl
            : `http://localhost:3003${record.imageUrl}`
        }
        alt="图片"
      />
    ),
  },
  {
    title: '跳转链接',
    dataIndex: 'linkUrl',
    valueType: 'text',
    hideInSearch: true,
  },
  {
    title: '创建时间',
    key: 'createdAt',
    dataIndex: 'createdAt',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a
        key="delete"
        onClick={async () => {
          await bannerDelReq(record.id);
          action?.reload?.();
        }}
      >
        删除
      </a>,
    ],
  },
];

export default () => {
  const actionRef = useRef();
  return (
    <ProTable
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(sort, filter);
        return bannerListReq();
      }}
      editable={{
        type: 'multiple',
        onSave: async (key, row) => {
          try {
            await bannerEditReq(key, row);
            message.success('保存成功');
            actionRef.current?.reload();
          } catch (error) {
            message.error('保存失败请重试！');
          }
        },
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="banner列表"
      toolBarRender={() => [<AddModel key="add"></AddModel>]}
    />
  );
};
