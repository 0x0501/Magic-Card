import {
	Button,
	Divider,
	Input,
	InputRef,
	Skeleton,
	Space,
	Table,
	Tag,
	Typography,
	notification,
} from "antd";
import React, { useRef, useState } from "react";

const { Column } = Table;
const { Text } = Typography;

import { SearchOutlined } from "@ant-design/icons";
import { open, save } from "@tauri-apps/api/dialog";
import { writeTextFile } from "@tauri-apps/api/fs";
import { Body, fetch } from "@tauri-apps/api/http";
import { desktopDir, resolve } from "@tauri-apps/api/path";
import { ColumnType } from "antd/es/table";
import { FilterConfirmProps } from "antd/es/table/interface";

enum DataStatus {
	USING = 0,
	UNUSED = 1,
	ACHIEVED = 2,
	EXCEPTION = 3,
}

interface DataType {
	key: React.Key;
	account: string;
	password: string;
	email: string;
	emailPassword: string;
	/**
	 * 0 -> using
	 * 1 -> unused
	 * 2 -> achieved
	 * 3 -> exception
	 */
	status: DataStatus;
}

type DataIndex = keyof DataType;

// const sample: DataType[] = [
// 	{
// 		key: "1",
// 		account: "abc123",
// 		password: "adsj134",
// 		email: "sdhisdn@example.com",
// 		emailPassword: "dsdsd",
// 		status: 0,
// 	},
// 	{
// 		key: "2",
// 		account: "aenx",
// 		password: "adsj134",
// 		email: "s012isdn@example.com",
// 		emailPassword: "dsdsd",
// 		status: 2,
// 	},
// 	{
// 		key: "3",
// 		account: "abc123",
// 		password: "adsj134",
// 		email: "sdhsnsdn@example.com",
// 		emailPassword: "dsdsd",
// 		status: 1,
// 	},
// 	{
// 		key: "4",
// 		account: "aenx",
// 		password: "adsj134",
// 		email: "s012isdn@example.com",
// 		emailPassword: "dsdsd",
// 		status: 2,
// 	},
// 	{
// 		key: "5",
// 		account: "abc123",
// 		password: "adsj134",
// 		email: "sdhsnsdn@example.com",
// 		emailPassword: "dsdsd",
// 		status: 3,
// 	},
// 	{
// 		key: "6",
// 		account: "aenx",
// 		password: "adsj134",
// 		email: "s012isdn@example.com",
// 		emailPassword: "dsdsd",
// 		status: 0,
// 	},
// 	{
// 		key: "7",
// 		account: "abc123",
// 		password: "adsj134",
// 		email: "sdhsnsdn@example.com",
// 		emailPassword: "dsdsd",
// 		status: 1,
// 	},
// 	{
// 		key: "8",
// 		account: "abc123",
// 		password: "adsj134",
// 		email: "sdhisdn@example.com",
// 		emailPassword: "dsdsd",
// 		status: 2,
// 	},
// 	{
// 		key: "9",
// 		account: "aenx",
// 		password: "adsj134",
// 		email: "s012isdn@example.com",
// 		emailPassword: "dsdsd",
// 		status: 0,
// 	},
// 	{
// 		key: "10",
// 		account: "abc123",
// 		password: "adsj134",
// 		email: "sdhsnsdn@example.com",
// 		emailPassword: "dsdsd",
// 		status: 0,
// 	},
// 	{
// 		key: "11",
// 		account: "aenx",
// 		password: "adsj134",
// 		email: "s012isdn@example.com",
// 		emailPassword: "dsdsd",
// 		status: 0,
// 	},
// 	{
// 		key: "12",
// 		account: "abc123",
// 		password: "adsj134",
// 		email: "sdhsnsdn@example.com",
// 		emailPassword: "dsdsd",
// 		status: 2,
// 	},
// 	{
// 		key: "13",
// 		account: "aenx",
// 		password: "adsj134",
// 		email: "s012isdn@example.com",
// 		emailPassword: "dsdsd",
// 		status: 2,
// 	},
// 	{
// 		key: "14",
// 		account: "abc123",
// 		password: "adsj134",
// 		email: "sdhsnsdn@example.com",
// 		emailPassword: "dsdsd",
// 		status: 3,
// 	},
// ];

const initResponse = await fetch("https://mg.0x0501.repl.co/private/all", {
	method: "GET",
	timeout: 30,
});

const initData: DataType[] = [];

//@ts-ignore
initResponse.data.map(record => {
	let newObj = {
		key: record._id,
		account: record.account,
		password: record.password,
		email: record.email,
		emailPassword: record.email_password,
		status: record.status,
	};
	initData.push(newObj);
});

function DataManagement() {
	const [data, setData] = useState(initData);
	const [_searchText, setSearchText] = useState("");
	const [_searchedColumn, setSearchedColumn] = useState("");
	const searchInput = useRef<InputRef>(null);


	////// Notification
	const [notificationAPI, contextHolder] = notification.useNotification();

	const openNotification = (msg: string, desc: string | React.JSX.Element) => {
		notificationAPI.info({
			message: msg,
			description: desc,
		});
	};

	////// Table Selection
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

	const hasSelected = selectedRowKeys.length > 0;

	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		setSelectedRowKeys(newSelectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};

	const handleSearch = (
		selectedKeys: string[],
		confirm: (param?: FilterConfirmProps) => void,
		dataIndex: DataIndex
	) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};

	const handleReset = (clearFilters: () => void) => {
		clearFilters();
		setSearchText("");
	};

	const getColumnSearchProps = (
		dataIndex: DataIndex
	): ColumnType<DataType> => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
			close,
		}) => (
			<div
				style={{ padding: 8 }}
				onKeyDown={e => e.stopPropagation()}
			>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={e =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() =>
						handleSearch(selectedKeys as string[], confirm, dataIndex)
					}
					style={{ marginBottom: 8, display: "block" }}
				/>
				<Space>
					<Button
						type='primary'
						onClick={() =>
							handleSearch(selectedKeys as string[], confirm, dataIndex)
						}
						icon={<SearchOutlined />}
						size='small'
						style={{ width: 90 }}
					>
						Search
					</Button>
					<Button
						onClick={() => {
							clearFilters && handleReset(clearFilters);
							confirm({ closeDropdown: true });
						}}
						size='small'
						style={{ width: 90 }}
					>
						Reset
					</Button>
					<Button
						type='link'
						size='small'
						onClick={() => {
							close();
						}}
					>
						close
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered: boolean) => (
			<SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes((value as string).toLowerCase()),
		onFilterDropdownOpenChange: visible => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
	});

	const renderFiltered = (status: DataStatus) => {
		switch (status) {
			case DataStatus.USING:
				return (
					<Tag
						color={"blue"}
						key={status}
					>
						使用中
					</Tag>
				);
			case DataStatus.UNUSED:
				return (
					<Tag
						color={"cyan"}
						key={status}
					>
						待用号
					</Tag>
				);
			case DataStatus.ACHIEVED:
				return (
					<Tag
						color={"purple"}
						key={status}
					>
						完成号
					</Tag>
				);
			case DataStatus.EXCEPTION:
				return (
					<Tag
						color={"red"}
						key={status}
					>
						异常号
					</Tag>
				);
		}
	};

	async function updateData() {
		const initResponse = await fetch("https://mg.0x0501.repl.co/private/all", {
			method: "GET",
			timeout: 30,
		});

		const initData: DataType[] = [];

		//@ts-ignore
		initResponse.data.map(record => {
			let newObj = {
				key: record._id,
				account: record.account,
				password: record.password,
				email: record.email,
				emailPassword: record.email_password,
				status: record.status,
			};
			initData.push(newObj);
		});
		return initData;
	}

	async function handleBunchImport() {
		const selected = await open({
			multiple: false,
			filters: [
				{
					name: "Data",
					extensions: ["txt"],
				},
			],
		});

		if (selected === null) return;

		const body = Body.form({
			key: "upload",
			data: {
				file: Array.isArray(selected) ? selected[0] : selected,
			},
		});

		fetch("https://mg.0x0501.repl.co/private/bunch/add", {
			method: "POST",
			timeout: 30,
			body: body,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
			.then(async res => {
				//@ts-ignore
				openNotification("通知", `成功导入${res.data.msg.insertCount}条数据`);
				setData(await updateData());
			})
			.catch(err => {
				console.error(err);
			});
	}

	async function handleBunchExport() {
		const selectedItems = data.filter(record =>
			selectedRowKeys.includes(record.key)
		);

		const desktop = await desktopDir();

		const defaultSavePath = await resolve(
			desktop,
			Date.now().toString() + ".txt"
		);

		const savePath =
			(await save({
				filters: [
					{
						name: "Data",
						extensions: ["txt"],
					},
				],
			})) ?? defaultSavePath;

		let fileBuff: string[] = [];

		selectedItems.forEach(item => {
			const prettier = `${item.account}--${item.password}--${item.email}--${item.emailPassword}`;
			fileBuff.push(prettier);
		});
		writeTextFile(savePath, fileBuff.join("\n")).then(() => {
			openNotification("通知", `已导出${selectedRowKeys.length}条数据`);
			setSelectedRowKeys([]);
		});
	}

	async function handleFlush() {
		updateData().then(data => {
			setData(data);
			openNotification("通知", "刷新成功");
		});
	}

	return (
		<>
			{data.length === 0 ? (
				<Skeleton active />
			) : (
				<div>
					{contextHolder}
					<Space align='center'>
						<Button
							type={"primary"}
							style={{ fontWeight: "bold" }}
							onClick={handleBunchExport}
							disabled={!hasSelected}
						>
							批量导出
						</Button>
						<Text>
							{hasSelected ? `已选择 ${selectedRowKeys.length} 条数据` : ""}
						</Text>
						<Button
							style={{ fontWeight: "bold" }}
							onClick={handleBunchImport}
						>
							批量导入
						</Button>
						<Button
							style={{ fontWeight: "bold" }}
							onClick={handleFlush}
						>
							刷新
						</Button>
					</Space>
					<Divider />
					<Table
						rowSelection={rowSelection}
						dataSource={data}
						scroll={{ y: "400px" }}
					>
						<Column
							title='账号'
							dataIndex='account'
							key='account'
							{...getColumnSearchProps("account")}
						/>
						<Column
							title='密码'
							dataIndex='password'
							key='password'
						/>
						<Column
							title='邮箱'
							dataIndex='email'
							key='email'
							{...getColumnSearchProps("email")}
						/>
						<Column
							title='邮箱密码'
							dataIndex='emailPassword'
							key='emailPassword'
						/>
						<Column
							title='账号状态'
							dataIndex='status'
							key='status'
							filters={[
								{
									text: "使用中",
									value: DataStatus.USING,
								},
								{
									text: "待用号",
									value: DataStatus.UNUSED,
								},
								{
									text: "完成号",
									value: DataStatus.ACHIEVED,
								},
								{
									text: "异常号",
									value: DataStatus.EXCEPTION,
								},
							]}
							onFilter={(value, record: DataType) => {
								return record.status === value;
							}}
							render={renderFiltered}
						/>
					</Table>
				</div>
			)}
		</>
	);
}

export default DataManagement;
