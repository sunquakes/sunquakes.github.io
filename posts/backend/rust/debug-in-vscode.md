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

## If you encounter the error "error: linker `link.exe` not found"

- Install GNU Toolchain

```bash
rustup toolchain install stable-x86_64-pc-windows-gnu
rustup default stable-x86_64-pc-windows-gnu
```
