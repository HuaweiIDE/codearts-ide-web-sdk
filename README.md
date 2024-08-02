# @huawei-ide/codearts
用于集成CodeArts IDE Web

## 如何使用

1. 安装 @huawei-ide/codearts
   `npm install @huawei-ide/codearts`

2. 引入 @huawei-ide/codearts
   `const ide = require('@huawei-ide/codearts');`

3. 预加载IDE
   其中id参数为挂载节点id，返回Promise：
   `ide.preload(id：string).then(() => {});`

4. 展示IDE
   `ide.show({width：string,height: string});`

5. 打开文件
   参数content为文件内容，类型为string，path是工程内文件的唯一路径，例如'src', 'src/tool', name为带后缀的文件名：
   ```
   ide.openFile({
        content: '## ReadME',
        path:'src',
        name: 'README.md'
    });
   ```

6. 销毁IDE
   `ide.dispose();`