import { BetaSchemaForm } from '@ant-design/pro-components';
import { Input, DatePicker, Form } from 'antd';
import { companiesReq, companiesEditReq } from '@/services/companies';
import Quill from '@/components/Quill';

const columns = [
  {
    dataIndex: 'id',
    fieldProps: {
      style: {
        display: 'none',
      },
    },
  },
  {
    title: '公司名称',
    dataIndex: 'name',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '请输入公司名称',
        },
      ],
    },
  },
  {
    title: '地址1',
    dataIndex: 'state',
  },
  {
    title: '地址',
    dataIndex: 'address',
  },
  {
    title: '地址3',
    dataIndex: 'zip',
  },
  {
    title: '城市',
    dataIndex: 'city',
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    name: 'description',
    title: '详情',
    renderFormItem: (item, formProps) => <Quill {...formProps} />,
    rules: [{ required: true, message: '请输入富文本内容' }],
  },
];

const CompaniesForm = () => {
  const handleFinish = async (values) => {
    try {
      if (values.id) {
        const d = { ...values };
        delete d.id;
        await companiesEditReq(values.id, d);
        console.log('提交成功');
      }
    } catch (error) {
      console.error('提交失败', error);
    }
  };

  return (
    <>
      <BetaSchemaForm
        shouldUpdate={false}
        layoutType="Form"
        request={async () => {
          let response = await companiesReq();
          return response?.data;
        }}
        onFinish={handleFinish}
        columns={columns}
      />
    </>
  );
};

export default CompaniesForm;
