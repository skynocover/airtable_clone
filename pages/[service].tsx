import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { AppContext } from '../components/AppContext';
import * as antd from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { DangerButton } from '../components/DangerButton';
import { MainPage } from '../components/MainPage';
import { Notification } from '../components/Notification';
import { getSession } from 'next-auth/client';

interface backup {
  filename: string;
  time: string;
}

export default function Service({
  backups,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const appCtx = React.useContext(AppContext);
  const router = useRouter();
  const [serviceName, setServiceName] = React.useState<string>('');

  React.useEffect(() => {
    if (error) {
      Notification.add('error', error);
    }
    setServiceName(router.query.service as string);
  }, [router.query.service]);

  const restore = async (item: backup) => {
    const data = await appCtx.fetch('post', `/api/db`, {
      serviceName,
      filename: item.filename,
    });
    if (data) {
      Notification.add('success', '還原成功');
      router.push(`/${serviceName}`);
    }
  };

  const columns: ColumnsType<backup> = [
    {
      title: 'filename',
      align: 'center',
      dataIndex: 'filename',
    },
    {
      align: 'center',
      render: (item) => (
        <DangerButton title="還原" message="確認還原?" onClick={() => restore(item)} />
      ),
    },
  ];

  const content = (
    <>
      <antd.Table dataSource={backups} columns={columns} pagination={false} />
    </>
  );
  return <MainPage content={content} menuKey={router.query.service as string} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
        props: {},
      };
    }

    let backups: backup[] = [];

    return { props: { backups } };
  } catch (error: any) {
    return { props: { error: error.message } };
  }
};
