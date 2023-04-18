import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import { WhileTypeArray } from '@/config';
import {
  menuListReq,
  menuAddReq,
  menuDelReq,
  menuDetailReq,
  menuEditReq,
} from '@/services';
import Operate from './operate';

// 内置类型不能编辑 产品分类，新闻分类
const editWhiteList = WhileTypeArray;

const MenuTable = () => {
  const [dataSource, setDataSource] = useState([]);

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入名称',
          },
          {
            max: 20,
            message: '名称最长不能超过20个字符',
          },
        ],
      },
    },
    {
      title: '链接',
      dataIndex: 'url',
      valueType: 'url',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        !editWhiteList.includes(record.id) && (
          <Operate
            key="edit"
            type="edit"
            text="编辑"
            dataSource={dataSource}
            onRefresh={fetchData}
            defaultValue={record}
          ></Operate>
        ),
        !editWhiteList.includes(record.id) && (
          <Popconfirm
            key="del"
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => onDelete(record.id)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            {' '}
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        ),
      ],
    },
  ];

  const onDelete = async (key) => {
    // 删除行数据
    try {
      await handleDelete(key);
      message.success('成功');
    } catch (error) {
      message.success('失败');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await menuListReq();
      const menuMap = {};
      const menuList = res.data;
      menuList.forEach((menu) => {
        if (!menuMap[menu.parentId]) {
          menuMap[menu.parentId] = [];
        }
        menuMap[menu.parentId].push(menu);
      });
      const buildTree = (parentId) => {
        if (!menuMap[parentId]) {
          return [];
        }
        return menuMap[parentId].map((menu) => {
          const tree = buildTree(menu.id);
          if (tree.length) {
            menu.children = tree;
          } else {
          }

          return menu;
        });
      };
      const tree = buildTree(null);
      console.log(tree, '-------------------');
      setDataSource(tree);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await menuDelReq(id);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <PageContainer>
      <EditableProTable
        rowKey="id"
        columns={columns}
        value={dataSource}
        recordCreatorProps={false}
        toolBarRender={() => [
          <Operate
            key="add"
            type="add"
            text="新建"
            dataSource={dataSource}
            onRefresh={fetchData}
          ></Operate>,
          <Button
            key="reset"
            onClick={() => {
              fetchData();
            }}
          >
            重置
          </Button>,
        ]}
        expandable={{
          defaultExpandAllRows: true,
          indentSize: 20,
        }}
      />
    </PageContainer>
  );
};

export default MenuTable;
