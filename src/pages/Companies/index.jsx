import { BetaSchemaForm } from '@ant-design/pro-components';
import { Input, DatePicker } from 'antd';
import { companiesReq, companiesEditReq } from '@/services/companies';

const columns = [
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
    title: '地址',
    dataIndex: 'address',
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
];

const CompaniesForm = () => {
  const handleFinish = async (values) => {
    try {
      if (values.id) {
        await companiesEditReq(values.id, values);
        console.log('提交成功');
      }
    } catch (error) {
      console.error('提交失败', error);
    }
  };

  return (
    <>
      <BetaSchemaForm
        initialValues={handleFinish()}
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
