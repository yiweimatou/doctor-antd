import React, {Component, PropTypes} from 'react';
import { Upload, Icon, Button, message } from 'antd'
import { host, signature, policy, accessid } from "../../constants"

class ImgUploader extends Component {
    state = {
        fileList: [],
        image: "",
    };

    componentWillMount() {
        if (this.props.fileList && this.props.fileList.length > 0) {
            this.setState({
                fileList: this.props.fileList
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const { fileList } = nextProps;
        this.setState({ fileList });
    }
    changeHandler = info => {
        let fileList = info.fileList;
        fileList = fileList.slice(-1);
        fileList = fileList.map(file => {
            if (this.state.image) {
                file.url = host + this.state.image;
                this.setState({ image: "" })
            }
            return file;
        });
        fileList = fileList.filter(file => {
            if (file.response) {
                if (file.response.code === 200) {
                    return true;
                } else {
                    message.error(
                        file.response.msg
                            ? file.response.msg
                            : "服务器未响应，请稍后再试",
                        6
                    );
                    return false;
                }
            }
            return true;
        });
        this.setState({ fileList });
        if (this.props.onChange) {
            this.props.onChange(fileList);
        }
        if (info.file.status === "error") {
            return message.error("服务器未响应，请稍后再试", 6);
        }
    };
    getSuffix = filename => {
        const pos = filename.lastIndexOf(".");
        var suffix = "";
        if (pos != -1) {
            suffix = filename.substring(pos);
        }
        return suffix;
    };
    random_string = len => {
        len = len || 32;
        var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
        var maxPos = chars.length;
        var pwd = "";
        for (var i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    };
    getObjectName = filename => {
        const suffix = this.getSuffix(filename);
        var g_object_name = "doctor/" + this.random_string(10) + suffix;
        return g_object_name
    };

    getData = file => {
        const key = this.getObjectName(file.name)        
        this.setState({ image: key })
        const new_multipart_params = {
            key,
            policy,
            OSSAccessKeyId: accessid,
            success_action_status: "200", //让服务端返回200,不然，默认会返回204
            signature,
        };
        return new_multipart_params;
    }
    getValue = () => this.state.fileList[0];
    render() {
        return (
            <Upload
                name="upload_file"
                action={host}
                listType="picture"
                fileList={this.state.fileList}
                onChange={this.changeHandler}
                data={this.getData}
                accept="image/jpeg, image/png"
                beforeUpload={file => {
                    const fiveM = 5 * 1024 * 1024;
                    const isToobig = file.size > fiveM;
                    if (isToobig) {
                        message.error("只允许上传不大于5M的图片!");
                    }
                    return !isToobig;
                }}
            >
                <Button type="ghost">
                    <Icon type="upload" />点击上传图片
                </Button>
            </Upload>
        );
    }
}

ImgUploader.propTypes = {
    fileList: PropTypes.array
};

export default ImgUploader;
