import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import {
  menuListReq,
  menuAddReq,
  menuDelReq,
  menuDetailReq,
  menuEditReq,
} from '@/services';
import Operate from './operate';

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
        <Operate
          key="edit"
          type="edit"
          text="编辑"
          dataSource={dataSource}
          onRefresh={fetchData}
          defaultValue={record}
        ></Operate>,
      ],
    },
  ];

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
        editable={{
          onSave: async (key, row) => {
            try {
              // 保存编辑数据
              await handleSave(key, row);
              message.success('成功');
            } catch (error) {
              message.success('失败');
            }
          },
          onDelete: async (key) => {
            // 删除行数据
            try {
              await handleDelete(key);
              message.success('成功');
            } catch (error) {
              message.success('失败');
            }
          },
          onChange: () => {},
        }}
        expandable={{
          defaultExpandAllRows: true,
          indentSize: 20,
        }}
      />
    </PageContainer>
  );
};

export default MenuTable;
