# Debug in VSCode

## Install Rust

- https://rust-lang.net.cn/tools/install

## Install LLVM

- https://github.com/llvm/llvm-project/releases/

## Install VSCode Extensions

- CodeLLDB
- rust-analyzer

## Create launch.json

- create .vscode/launch.json file

```json
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug Rust with LLDB",
            "type": "lldb",
            "request": "launch",
            "program": "${workspaceFolder}/target/debug/hw.exe",
            "args": [],
            "cwd": "${workspaceFolder}",
            "preLaunchTask": "rust: cargo build"
        }
    ]
}
```
