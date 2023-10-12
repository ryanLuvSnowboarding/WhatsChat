import React, { forwardRef } from "react";
import { Form, Upload, Input } from "antd";
import { InboxOutlined } from "@ant-design/icons";

// the difference between this export method and export default is that this export method
//prohibits other users to name PostForm in other names
export const PostForm = forwardRef((props, formRef) => {
  // forwardRef is like a decoration
  // formRef is user-input reference from CreatPostButton
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  //   拖完文件后会产生一个事件，然后return你上传的内容
  return (
    <Form name="validate_other" {...formItemLayout} ref={formRef}>
      <Form.Item
        name="description"
        label="Message"
        // rules is the validation, define what have to be filled
        rules={[
          {
            required: true,
            message: "Please input your E-mail!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Dragger">
        <Form.Item
          name="uploadPost"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          noStyle
          rules={[
            {
              required: true,
              message: "Please select an image/video!",
            },
          ]}
        >
          <Upload.Dragger name="files" beforeUpload={() => false}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form.Item>
    </Form>
  );
});
