import {
  AlipayOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoOutlined,
  UserOutlined,
  WeiboOutlined,
} from "@ant-design/icons";
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import { Alert, Button, Divider, Space, Tabs, message, theme } from "antd";
import type { CSSProperties } from "react";
import { useState } from "react";
import { AxiosAPI } from "../libs/AxiosAPI";

type LoginType = "phone" | "account";

const api = new AxiosAPI();

const iconStyles: CSSProperties = {
  color: "rgba(0, 0, 0, 0.2)",
  fontSize: "18px",
  verticalAlign: "middle",
  cursor: "pointer",
};

const LoginView = ({ onLogin }) => {
  const [loginType, setLoginType] = useState<LoginType>("account");
  const { token } = theme.useToken();

  function usernameChangeHandler(meta: MetaEvent): void {
    console.log("Function not implemented:usernameChangeHandler", meta);
  }

  function passwordChangeHandler(meta: MetaEvent): void {
    console.log("Function not implemented:passwordChangeHandler", meta);
  }

  const [errorNotice, setErrorNotice] = useState({
    triggered: false,
    type: "info",
    message: "Invalid login credentials.",
  });

  return (
    <div
      style={{
        backgroundColor: "white",
        height: "100vh",
      }}
    >
      <ProConfigProvider dark>
        <LoginFormPage
          backgroundImageUrl="https://img.freepik.com/free-vector/white-abstract-background_23-2148806276.jpg?semt=ais_hybrid&w=1920"
          logo="http://inboxgroup.ai/simplexai/logo-white.png"
          backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
          title=""
          containerStyle={{
            backgroundColor: "rgba(0, 0, 0,0.65)",
            backdropFilter: "blur(4px)",
          }}
          onFinish={async (values) => {
            setErrorNotice({
              triggered: false,
              message: "",
              type: "info",
            });
            console.log(values);
            try {
              const loggedIn = await api.login(
                values.username,
                values.password
              );
              console.log("loggedIn : YES", loggedIn);
              setErrorNotice({
                triggered: true,
                message: "Login successful!",
                type: "success",
              });
              localStorage.setItem("simplex-token", loggedIn.result.token);
              setTimeout(() => {
                window.location.href = "/documents/list";
                //onLogin(true);
              }, 1000);
            } catch (error: any) {
              console.log("loggedIn : NO", error);
              setErrorNotice({
                triggered: true,
                message: error.response.data.message,
                type: "error",
              });
              //onLogin(false);
            }
          }}
          subTitle="Login"
          submitter={{ searchConfig: { submitText: "Login" } }}
          activityConfig={{
            style: {
              boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
              color: token.colorTextHeading,
              borderRadius: 8,
              backgroundColor: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(4px)",
            },
            title: "Login",
            subTitle: "",
            action: (
              <Button
                size="large"
                style={{
                  borderRadius: 20,
                  background: token.colorBgElevated,
                  color: token.colorPrimary,
                  width: 120,
                }}
              >
                LOGIN
              </Button>
            ),
          }}
          actions={<></>}
        >
          {errorNotice.triggered && (
            <Alert
              message={errorNotice.message}
              onClose={() => {
                setErrorNotice({ triggered: false, message: "" });
              }}
              type={errorNotice.type}
              showIcon
              closable
              style={{
                marginBottom: 24,
              }}
            />
          )}
          <Tabs
            centered
            activeKey={loginType}
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
          >
            <Tabs.TabPane key={"account"} tab={"Account"} />
            <Tabs.TabPane key={"phone"} tab={"Phone"} />
          </Tabs>
          {loginType === "account" && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: "large",
                  prefix: (
                    <UserOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={"prefixIcon"}
                    />
                  ),
                }}
                placeholder={"Username"}
                onMetaChange={usernameChangeHandler}
                rules={[
                  {
                    required: true,
                    message: "Username is required",
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: "large",
                  prefix: (
                    <LockOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={"prefixIcon"}
                    />
                  ),
                }}
                placeholder={"Password"}
                onMetaChange={passwordChangeHandler}
                rules={[
                  {
                    required: true,
                    message: "Password is required",
                  },
                ]}
              />
            </>
          )}
          {loginType === "phone" && (
            <>
              <ProFormText
                fieldProps={{
                  size: "large",
                  prefix: (
                    <MobileOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={"prefixIcon"}
                    />
                  ),
                }}
                name="mobile"
                placeholder={"Mobile number"}
                rules={[
                  {
                    required: true,
                    message: "Phone number is required",
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: "Enter correct number pattern",
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: "large",
                  prefix: (
                    <LockOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={"prefixIcon"}
                    />
                  ),
                }}
                captchaProps={{
                  size: "large",
                }}
                placeholder={"OTP"}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} attemps remaining`;
                  }
                  return "Send OTP";
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: "OTP is required",
                  },
                ]}
                onGetCaptcha={async () => {
                  message.success("Logged In!");
                }}
              />
            </>
          )}
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              Remember me
            </ProFormCheckbox>
            <a
              style={{
                float: "right",
              }}
            >
              Reset Password
            </a>
          </div>
        </LoginFormPage>
      </ProConfigProvider>
    </div>
  );
};

export default LoginView