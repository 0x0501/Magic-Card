import { Badge, Col, Space, Table, Tag, Tree, Typography } from "antd";
import React, { useState } from "react";

const { Title, Text, Paragraph } = Typography;
import type { TableColumnsType } from "antd";

const { Column, ColumnGroup } = Table;

interface ParamNode {
	key: React.Key;
	paramName: string; // request parameter name
	desc: string; // description for this parameter,
	required: boolean; // whether the param is required or not
}

interface ApiDocStructure {
	key: React.Key;
	funcName: string; // RUST-ful API functionality
	path: string; // API PATH (excluded hostname)
	method: "POST" | "GET"; // request method
	params: ParamNode[];
}

const APIDOC: ApiDocStructure[] = [
	{
		key: 1,
		funcName: "添加账号",
		path: "/add",
		method: "POST",
		params: [
			{
				key: 1,
				paramName: "account",
				desc: "账号 (String)",
				required: true,
			},
			{
				key: 2,
				paramName: "skey",
				desc: "密码 (String)",
				required: true,
			},
			{
				key: 3,
				paramName: "email",
				desc: "邮箱 (String)",
				required: true,
			},
			{
				key: 4,
				paramName: "e-skey",
				desc: "邮箱密码 (String)",
				required: true,
			},
			{
				key: 5,
				paramName: "tmp",
				desc: "GMT Timestamp Millisecond (String)",
				required: true,
			},
			{
				key: 6,
				paramName: "sign",
				desc: "请求签名, 具体细节请看下方 (String)",
				required: true,
			},
		],
	},
	{
		key: 2,
		funcName: "删除账号",
		path: "/del",
		method: "POST",
		params: [
			{
				key: 1,
				paramName: "account",
				desc: "需要删除的账号名 (String)",
				required: true,
			},
			{
				key: 2,
				paramName: "tmp",
				desc: "GMT Timestamp Millisecond (String)",
				required: true,
			},
			{
				key: 3,
				paramName: "sign",
				desc: "请求签名, 具体细节请看下方 (String)",
				required: true,
			},
		],
	},
	{
		key: 3,
		funcName: "获取账号",
		path: "/rev",
		method: "POST",
		params: [
			{
				key: 1,
				paramName: "sign",
				desc: "请求签名 (String)",
				required: true,
			},
			{
				key: 2,
				paramName: "tmp",
				desc: "GMT Timestamp Millisecond (String)",
				required: true,
			},
		],
	},
	{
		key: 4,
		funcName: "改变账号状态",
		path: "/state",
		method: "POST",
		params: [
			{
				key: 1,
				paramName: "account",
				desc: "需要更改的账号 (String)",
				required: true,
			},
			{
				key: 2,
				paramName: "state",
				desc: "需要改变的状态 (Number) 可选值:0 (使用中), 1 (未使用), 2 (完成号), 3 (异常号)",
				required: true,
			},
			{
				key: 3,
				paramName: "tmp",
				desc: "GMT Timestamp Millisecond (String)",
				required: true,
			},
			{
				key: 4,
				paramName: "sign",
				desc: "请求签名 (String)",
				required: true,
			},
		],
	},
	{
		key: 5,
		funcName: "测试API连通性",
		path: "/ping",
		method: "GET",
		params: [
			{
				key: 1,
				paramName: "tmp",
				desc: "GMT Timestamp Millisecond (String)",
				required: false,
			},
		],
	},
];

function APISettings() {
	const [apiHost, setApiHost] = useState("https://mg.0x0501.repl.co/api");

	const expandedRowRender = (
		_record: ApiDocStructure,
		index: number,
		_indent: number,
		_expanded: boolean
	) => {
		const expandedColumns: TableColumnsType<ParamNode> = [
			{
				title: "Parameter Name",
				dataIndex: "paramName",
				key: "paramName",
				render: text => <Text code>{text}</Text>,
			},
			{
				title: "Description",
				dataIndex: "desc",
				key: "desc",
			},
			{
				title: "Required",
				dataIndex: "required",
				key: "required",
				render: text =>
					text ? (
						<Badge
							status={"success"}
							text='Required'
						/>
					) : (
						<Badge
							status={"default"}
							text='Not required'
						/>
					),
			},
		];

		return (
			<Table
				columns={expandedColumns}
				dataSource={APIDOC[index].params}
				pagination={false}
			/>
		);
	};

	return (
		<div>
			<Title level={2}>API Settings</Title>

			<Paragraph>
				<Text>
					API请求地址:{" "}
					<Text
						code
						copyable
					>
						{apiHost}
					</Text>
				</Text>
			</Paragraph>
			<Table
				dataSource={APIDOC}
				scroll={{ y: "400px" }}
				expandable={{ expandedRowRender }}
			>
				<Column
					title='接口名称'
					dataIndex='funcName'
				/>
				<Column
					title='Path'
					dataIndex='path'
					render={text => <Text code>{text}</Text>}
				/>
				<Column
					title='Method'
					dataIndex='method'
					render={text => <Text code>{text}</Text>}
				/>
			</Table>
		</div>
	);
}

export default APISettings;
