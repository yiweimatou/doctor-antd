// import React, {Component} from 'react';
// import { Upload, Button, Icon } from 'antd'

// class Test extends Component {
//     state = {
//         fileList: []
//     }
//     handleChange = (info) => {
//         let fileList = info.fileList;

//         // 1. 上传列表数量的限制
//         //    只显示最近上传的一个，旧的会被新的顶掉
//         fileList = fileList.slice(-1);

//         // 2. 读取远程路径并显示链接
//         fileList = fileList.map((file) => {
//         if (file.response) {
//             // 组件会将 file.url 作为链接进行展示
//             file.url = file.response.url;
//         }
//         return file;
//         });

//         // 3. 按照服务器返回信息筛选成功上传的文件
//         fileList = fileList.filter((file) => {
//         if (file.response) {
//             return file.response.status === 'success';
//         }
//         return true;
//         });

//         this.setState({ fileList });
//     }
//     render() {
//         const props = {
//             name: 'file',
//             action: 'http://image.yiweimatou.com:999/cover',
//             onChange: this.handleChange,
//             multiple: false,
//         }
//         return (
//             <Upload {...props} fileList={this.state.fileList}>
//                 <Button type="ghost">
//                 <Icon type="upload" /> 点击上传
//                 </Button>
//             </Upload>
//         );
//     }
// }

// export default Test;