import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "../App.css";
import { Button, Layout, Menu, theme } from "antd";
import {
	DatabaseFilled,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	SecurityScanFilled,
	SettingFilled,
} from "@ant-design/icons";
import DataManagement from "./DataManagement";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

function Root() {
	const [greetMsg, setGreetMsg] = useState("");
	const [name, setName] = useState("");

	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	const navigate = useNavigate();

	const location = useLocation();

	async function greet() {
		// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
		setGreetMsg(await invoke("greet", { name }));
	}

	return (
		<Layout style={{ height: "100%" }}>
			<Sider
				trigger={null}
				collapsed={collapsed}
				collapsible
			>
				<div className='logo'></div>
				<Menu
					theme={"dark"}
					mode={"inline"}
					defaultSelectedKeys={["1"]}
					items={[
						{
							key: "1",
							icon: <DatabaseFilled />,
							label: "Data Management",
							onClick: () => navigate("/"),
						},
						{
							key: "2",
							icon: <SecurityScanFilled />,
							label: "Token Management",
							onClick: () => navigate("token"),
						},
						{
							key: "3",
							icon: <SettingFilled />,
							label: "API Settings",
							onClick: () => navigate("api"),
						},
					]}
				/>
			</Sider>
			<Layout>
				<Header style={{ padding: 0, background: colorBgContainer }}>
					<Button
						type={"text"}
						icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
						onClick={() => setCollapsed(prev => !prev)}
						style={{
							fontSize: "16px",
							width: 64,
							height: 64,
						}}
					/>
				</Header>
				<Content
					style={{
						margin: "24px 16px",
						padding: 24,
						minHeight: 280,
						background: colorBgContainer,
					}}
				>
					{location.pathname == "/" ? <DataManagement /> : <Outlet />}
				</Content>
			</Layout>
		</Layout>
	);
}

export default Root;
