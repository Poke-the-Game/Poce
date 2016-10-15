# Poce
Printer operation and control engine

## Raspbian configuration

### no boot messages [avoid printing letter soup ;)]

`/boot/config.txt`
```bash
# disable icon for undervoltage and overtemperature
avoid_warnings=1

# disable splash (rainbow)
disable_splash=1
```

`/boot/cmdline.txt`

```bash
... console=tty2 logo.nologo ... quiet nosplash
```
