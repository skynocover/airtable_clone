import React from 'react';
import * as antd from 'antd';

import { AppContext, service } from './AppContext';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/client';

interface MainPageProps {
  menuKey: string;
  content: JSX.Element;
}

const MainPage = ({ menuKey, content }: MainPageProps) => {
  const router = useRouter();
  const appCtx = React.useContext(AppContext);

  const renderHeader = () => {
    return (
      <antd.Layout.Header
        className="flex items-center px-3 bg-white shadow-sm"
        style={{ zIndex: 1 }}
      >
        <div>
          <span className="ml-2 text-white">{menuKey}</span>
        </div>

        <div className="flex-1" />
        <antd.Popover
          placement="bottom"
          content={
            <div className="flex flex-column">
              <antd.Button
                type="link"
                danger
                onClick={() => {
                  router.push('/');
                  signOut();
                }}
              >
                登出
              </antd.Button>
            </div>
          }
        >
          <antd.Button type="link" icon={<i className="fa fa-user mr-2" />}>
            {`使用者 : ${appCtx.account}`}
          </antd.Button>
        </antd.Popover>
      </antd.Layout.Header>
    );
  };

  const renderContent = () => {
    return (
      <antd.Layout.Content style={{ overflow: 'auto' }}>
        <div className="m-3">{content}</div>
      </antd.Layout.Content>
    );
  };

  const renderMenu = () => {
    const init: service[] = [{ id: '', name: 'Home', port: '', domain: '' }];
    return (
      <antd.Layout.Sider collapsible trigger={null} style={{ overflow: 'auto' }}>
        <antd.Menu
          theme="dark"
          mode="inline"
          selectedKeys={[menuKey]}
          onClick={({ key }) => {
            router.push(key);
          }}
        >
          {init.concat(appCtx.dataSource).map((server) => {
            return (
              <antd.Menu.Item key={server.name}>
                <span className="flex items-center">
                  <span>{server.name}</span>
                </span>
              </antd.Menu.Item>
            );
          })}
        </antd.Menu>
      </antd.Layout.Sider>
    );
  };

  return (
    <antd.Layout className="h-screen">
      {renderMenu()}

      <antd.Layout className="bg-white">
        {renderHeader()}
        {renderContent()}
      </antd.Layout>
    </antd.Layout>
  );
};

export { MainPage };
