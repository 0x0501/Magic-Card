import { invoke } from "@tauri-apps/api";
import { Typography, Alert, Space, Button, notification } from "antd";
import { useState } from "react";
import CryptoJS from "crypto-js";
import { fetch } from "@tauri-apps/api/http";

const { Text, Paragraph } = Typography;

interface ServerResponse {
	code: number;
	msg: {
		tokenStatus: boolean;
		token: string;
	};
}

const tokenResponse = await fetch<ServerResponse>(
	"https://mg.0x0501.repl.co/private/tokenStatus",
	{
		method: "GET",
		timeout: 30,
	}
);

async function decryptedToken(rawToken: string) {
	if (rawToken === "") {
		return "";
	}

	const key: string = await invoke("get_raw_key");
	const iv: string = await invoke("get_raw_iv");

	const cipher = CryptoJS.AES.decrypt(rawToken, CryptoJS.SHA512(key), {
		iv: CryptoJS.SHA512(iv),
	});

	console.log(cipher.toString(CryptoJS.enc.Utf8));

	return cipher.toString(CryptoJS.enc.Utf8);
}

const TokenData = await decryptedToken(tokenResponse.data.msg.token);

function TokenManagement() {
	const [token, setToken] = useState(TokenData);
	const [tokenStatus, _setTokenStatus] = useState(
		tokenResponse.data.msg.tokenStatus
	);

	////// Notification
	const [notificationAPI, contextHolder] = notification.useNotification();

	const openNotification = (msg: string, desc: string | React.JSX.Element) => {
		notificationAPI.info({
			message: msg,
			description: desc,
		});
	};

	const TokenMessage = (
		<Paragraph>
			Token用于和服务器进行通信以及API调用，一旦泄露，他人有可能进行恶意操作。
		</Paragraph>
	);

	function handleTokenReset() {
		fetch<ServerResponse>("https://mg.0x0501.repl.co/private/resetToken", {
			method: "POST",
			timeout: 30,
		}).then(res => {
			decryptedToken(res.data.msg.token).then(data => {
				setToken(data);
				openNotification("通知", "Token设置成功")
			});
		});
	}

	return (
		<div>
			<h1>Token</h1>
			{contextHolder}
			<Paragraph>
				{tokenStatus ? (
					<p
						style={{
							padding: "6px 0",
						}}
					>
						当前Token:
					</p>
				) : (
					<Paragraph>
						<Alert
							message='未设置Token将导致API无法正常工作'
							banner
						/>
					</Paragraph>
				)}
				<Space size={"middle"}>
					{tokenStatus ? (
						<Text
							code
							style={{ fontSize: "18px" }}
						>
							{token}
						</Text>
					) : (
						""
					)}

					<Button
						type={"primary"}
						onClick={handleTokenReset}
					>
						{tokenStatus ? "重新生成 Token" : "生成Token"}
					</Button>
				</Space>
			</Paragraph>
			<Alert
				type='info'
				message='Token 注意事项'
				description={TokenMessage}
			/>
		</div>
	);
}

export default TokenManagement;
