import Sidebar from "../components/Sidebar";

import { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  FileOutlined,
  FileDoneOutlined,
  SignalFilled,
  SettingFilled,
  ImportOutlined,
} from "@ant-design/icons";

import { Button, Layout, Menu, theme } from "antd";

const { Header, Sider, Content } = Layout;

function MenuPrincipal() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <>
      <Layout style={{minHeight: '100vh', width: '100%'}}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <UserOutlined />,
                label: "Home",
              },
              {
                key: "2",
                icon: <FileOutlined />,
                label: "Gestión de Tareas",
              },
              {
                key: "3",
                icon: <FileDoneOutlined />,
                label: "Corrección de Tareas",
              },
              {
                key: "4",
                icon: <ImportOutlined />,
                label: "Cursos",
              },
              {
                key: "5",
                icon: <SignalFilled />,
                label: "Reportes",
              },
              {
                key: "6",
                icon: <SettingFilled />,
                label: "Configuración",
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: '#4AA892' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            
          </Header>
          <Content
            style={{
              margin: 10,
              padding: 24,
              minHeight: 280,
              background: '#C7C7C7',
              borderRadius: borderRadiusLG,
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default MenuPrincipal;
