# @huawei-ide/codearts

用于集成 CodeArts IDE Web

## 如何使用

1. 安装 @huawei-ide/codearts  
   `npm install @huawei-ide/codearts`

2. 引入 @huawei-ide/codearts  
   `const ide = require('@huawei-ide/codearts');`

3. 预加载 IDE, 返回 Promise：  
   `await ide.preload();`

4. 展示 IDE  
   其中 id 参数为挂载节点 id, 返回 Promise：
   `ide.show(id: string, {width：string,height: string}).then(() => {});`

5. 打开文件，默认可编辑  
   参数 content 为文件内容，类型为 string，path 是工程内文件的唯一路径，例如'src', 'src/tool', name 为带后缀的文件名：

   ```
   ide.openFile({
        content: '## ReadME',
        path:'src',
        name: 'README.md'
    });
   ```
   如果需要传入pdf文件，content需要设置为空，path为pdf资源链接，name为pdf文件名。

6. 设置文件是否为预览(只读)状态  
   `ide.setPreview(preview: boolean)`

7. 获取当前文件最新内容，返回 Promise：  
   `await ide.getContent();`

8. 设置 DomainId 及 UserId：  
   `ide.setUserId(domainId: string, userId: string);`

9. 监听当前文件变化

   ```
   const event = ide.onDidChange(listener: (content: string) => {});
   // 销毁监听
   event.dispose();
   ```

10. 设置图片、文件前缀：  
   `ide.setImgPrefix(prefix: string);`  
   `ide.setFilePrefix(prefix: string);`

11. 设置Mardown文件中iframe的source:   
   `ide.setIframeOrigin(origin: string);`

12. 设置深色/浅色主题:   
   `ide.setColorTheme(theme: string);`
   ```
   // 深色
   ide.setColorTheme('dark');
   // 浅色
   ide.setColorTheme('light');
   ```

13. 设置编辑器内文字字体大小:   
   `ide.setEditorFontSize(fontSize: number);`

14. 设置是否开启代码操作气泡：
   发送信息命令：gitcode.send.message
   `ide.registerCodeOperation(options: CodeOperationOptions);`
   ```typescript
   export interface CodeOperationOptions {
		/**
		 * The icon of the code operation toolbox, if not set, use default.
		 */
		icon?: string;

		/**
		 * The title of the code operation tool div
		 */
		title?: string;

		/**
		 * The opertion list.
		 */
		operations: CodeOperation[];
	}

   export interface CodeOperation {
		/**
		 * The label of the operation
		 */
		label: string;

		/**
		 * The option of the command which will be executed when click the operation button
		 */
		command: {
			/**
			 * The title of the command
			 */
			title?: string;

			/**
			 * Command id
			 */
			id: string;

			/**
			 * The arguments of the command
			 */
			args?: any[];

			/**
			 * whether the keybinding shortcuts will be displayed, default to be true
			 */
			showKeybinding?: boolean;
		};
	}
   ```

15. 监听当前点击发送代码片段

   ```
   const event = ide.onDidSendCode(listener: (content: string) => {});
   // 销毁监听
   event.dispose();
   ```

16. 销毁 IDE  
    `ide.dispose();`
